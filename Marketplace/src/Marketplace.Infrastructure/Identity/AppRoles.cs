namespace Marketplace.Infrastructure.Identity;

public static class AppRoles
{
    public const string User = "User";
    public const string Moderator = "Moderator";
    public const string Admin = "Admin";

    public static readonly string[] All =
    {
        User,
        Moderator,
        Admin
    };
}
