using Marketplace.Application.Common.Interfaces;
using Marketplace.Infrastructure.Identity;
using Marketplace.Infrastructure.Persistence;
using Marketplace.Infrastructure.Repositories;
using Marketplace.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
namespace Marketplace.Infrastructure;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Infrastructure.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<MarketplaceDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("DefaultConnection")));
        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
        {
            options.Password.RequiredLength = 8;
            options.Password.RequireDigit = true;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            // Lockout (optional, good for production)
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        })
.AddEntityFrameworkStores<MarketplaceDbContext>()
.AddDefaultTokenProviders();

        services.AddScoped<IListingRepository, ListingRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IFavoriteRepository, FavoriteRepository>();
        services.AddScoped<IListingReportRepository, ListingReportRepository>();
        services.AddScoped<IUserDirectory, UserDirectory>();
        services.AddScoped<IUserProfileRepository, UserProfileRepository>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ISellerReadService, SellerReadService>();
        services.AddScoped<ICategoryAttributeRepository, CategoryAttributeRepository>();
        services.AddScoped<ILocationRepository, LocationRepository>();


        return services;
    }
}
