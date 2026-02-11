using Marketplace.Application.Common.Auth;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Marketplace.Infrastructure.Identity;

public sealed class TokenService : ITokenService
{
    private readonly JwtOptions _jwt;
    private readonly MarketplaceDbContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public TokenService(
        IOptions<JwtOptions> jwtOptions,
        MarketplaceDbContext db,
        UserManager<ApplicationUser> userManager)
    {
        _jwt = jwtOptions.Value;
        _db = db;
        _userManager = userManager;
    }

    public async Task<TokenPair> CreateTokenPairAsync(
        Guid userId,
        string email,
        CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        // 1) Roles
        var user = await _userManager.FindByIdAsync(userId.ToString());
        var roles = user is null
            ? new List<string>()
            : (await _userManager.GetRolesAsync(user)).ToList();

        // 2) Claims
        var claims = new List<Claim>
{
    new(JwtRegisteredClaimNames.Sub, userId.ToString()),
    new(JwtRegisteredClaimNames.Email, email),
    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }


        // 3) JWT
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var accessExpires = now.AddMinutes(_jwt.AccessTokenMinutes);

        var jwtToken = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            notBefore: now,
            expires: accessExpires,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);

        // 4) Refresh token
        var refreshToken = GenerateSecureToken();
        var refreshExpires = now.AddDays(_jwt.RefreshTokenDays);

        await _db.RefreshTokens.AddAsync(
            new RefreshToken(userId, refreshToken, refreshExpires), ct);

        await _db.SaveChangesAsync(ct);

        return new TokenPair(
            accessToken,
            accessExpires,
            refreshToken,
            refreshExpires
        );
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Base64UrlEncoder.Encode(bytes);
    }
}
