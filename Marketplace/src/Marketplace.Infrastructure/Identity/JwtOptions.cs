namespace Marketplace.Infrastructure.Identity;

public sealed class JwtOptions
{
    public string Issuer { get; init; } = null!;
    public string Audience { get; init; } = null!;
    public string Key { get; init; } = null!;

    // Access token lifetime in minutes (short-lived)
    public int AccessTokenMinutes { get; init; } = 15;

    // Refresh token lifetime in days
    public int RefreshTokenDays { get; init; } = 30;
}
