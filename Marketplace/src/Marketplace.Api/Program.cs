using Marketplace.Api.Common;
using Marketplace.Api.Middleware;
using Marketplace.Application;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Infrastructure;
using Marketplace.Infrastructure.Identity;
using Marketplace.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// JWT CONFIGURATION (STRONGLY TYPED – REQUIRED)
// --------------------------------------------------
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("Jwt"));

builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<JwtOptions>>().Value);

// --------------------------------------------------
// AUTHENTICATION / AUTHORIZATION
// --------------------------------------------------
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwt = builder.Configuration
        .GetSection("Jwt")
        .Get<JwtOptions>()!;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        RoleClaimType = ClaimTypes.Role,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwt.Issuer,
        ValidAudience = jwt.Audience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwt.Key)),
        ClockSkew = TimeSpan.Zero
    };

    // 🔥 THIS IS REQUIRED FOR SIGNALR
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/hubs/chat"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});



IdentityModelEventSource.ShowPII = true;



builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder(
            JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build();

    options.AddPolicy("UserOnly", policy =>
        policy
            .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
            .RequireRole(AppRoles.User));
    options.AddPolicy("AdminOnly", policy =>
      policy
          .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
          .RequireRole(AppRoles.Admin));
});


// --------------------------------------------------
// RATE LIMITING
// --------------------------------------------------
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("send-message", context =>
    {
        var userId = context.User?.Identity?.IsAuthenticated == true
            ? context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            : context.Connection.RemoteIpAddress?.ToString();

        return RateLimitPartition.GetTokenBucketLimiter(
            userId ?? "anonymous",
            _ => new TokenBucketRateLimiterOptions
            {
                TokenLimit = 10,
                TokensPerPeriod = 10,
                ReplenishmentPeriod = TimeSpan.FromMinutes(1),
                AutoReplenishment = true,
                QueueLimit = 0
            });
    });

    options.AddPolicy("report-listing", context =>
    {
        var userId = context.User?.Identity?.IsAuthenticated == true
            ? context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            : context.Connection.RemoteIpAddress?.ToString();

        return RateLimitPartition.GetFixedWindowLimiter(
            userId ?? "anonymous",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(10),
                AutoReplenishment = true,
                QueueLimit = 0
            });
    });
});

// --------------------------------------------------
// SERVICES
// --------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddScoped<IErrorLocalizer, ErrorLocalizer>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IErrorHttpMapper, ErrorHttpMapper>();
builder.Services.AddScoped<IRealtimeNotifier, RealtimeNotifier>();
builder.Services.AddSingleton<PresenceTracker>();
builder.Services.AddSingleton<Marketplace.Application.Common.Interfaces.IFileStorage>(sp =>
{
    var env = sp.GetRequiredService<IWebHostEnvironment>();
    return new Marketplace.Infrastructure.Storage.LocalFileStorage(env.WebRootPath);
});

// --------------------------------------------------
// LOCALIZATION
// --------------------------------------------------
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[]
    {
        new CultureInfo("mk"),
        new CultureInfo("sq"),
        new CultureInfo("en")
    };

    options.DefaultRequestCulture = new RequestCulture("mk");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
    options.RequestCultureProviders.Insert(0, new AcceptLanguageHeaderRequestCultureProvider());
});

// --------------------------------------------------
// SIGNALR & CORS
// --------------------------------------------------
// before: builder.Services.AddSignalR();
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("client", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173","http://89.167.3.212:7101", "http://89.167.3.212")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// --------------------------------------------------
// BUILD
// --------------------------------------------------
var app = builder.Build();

// --------------------------------------------------
// DATABASE / IDENTITY SEEDING
// --------------------------------------------------
// --------------------------------------------------
// DATABASE / IDENTITY SEEDING
// --------------------------------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var db = services.GetRequiredService<MarketplaceDbContext>();

    // ✅ ALWAYS migrate FIRST
    await db.Database.MigrateAsync();

    // ✅ THEN seed Identity
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await IdentitySeeder.SeedRolesAsync(roleManager);

    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var config = services.GetRequiredService<IConfiguration>();
    await IdentitySeeder.SeedAdminAsync(userManager, config);

    // ✅ THEN seed domain data
    await CategorySeeder.SeedAsync(db);
}


// --------------------------------------------------
// PIPELINE (ORDER MATTERS)
// --------------------------------------------------
// --------------------------------------------------
// PIPELINE (ORDER MATTERS)
// --------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("client");

// Localization early
app.UseRequestLocalization(
    app.Services.GetRequiredService<IOptions<RequestLocalizationOptions>>().Value);

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Vary", "Accept-Language");
    await next();
});

app.UseHttpsRedirection();
app.UseRateLimiter();

// ✅ STATIC FILES MUST COME BEFORE ROUTING
app.UseDefaultFiles();   // maps "/" → index.html
app.UseStaticFiles();    // serves wwwroot

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();

app.MapHub<Marketplace.Api.Hubs.ChatHub>("/hubs/chat");

// API routes
app.MapControllers();

// ✅ SPA fallback (client-side routing)
app.MapFallbackToFile("index.html");

app.Run();

