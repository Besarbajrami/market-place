using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Marketplace.Infrastructure.Identity;

public static class IdentitySeeder
{
    public static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        foreach (var role in AppRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }
    public static async Task SeedAdminAsync(
    UserManager<ApplicationUser> userManager,
    IConfiguration config)
    {
        var section = config.GetSection("AdminSeed");
        if (!section.Exists()) return;

        var email = section["Email"];
        var password = section["Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

        var user = await userManager.FindByEmailAsync(email);
        if (user != null) return;

        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded) return;

        await userManager.AddToRoleAsync(user, AppRoles.Admin);
    }

}
