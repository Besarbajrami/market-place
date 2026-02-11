using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public sealed class RefreshToken : BaseEntity
{
    private RefreshToken() { } // EF

    public RefreshToken(Guid userId, string token, DateTime expiresAt)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid UserId { get; private set; }
    public string Token { get; private set; } = null!;
    public DateTime ExpiresAt { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt != null;

    public void Revoke(DateTime nowUtc)
    {
        RevokedAt = nowUtc;
        UpdatedAt = nowUtc;
    }
}
