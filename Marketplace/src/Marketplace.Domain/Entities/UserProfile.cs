using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class UserProfile : BaseEntity
{
    private UserProfile() { } // EF

    public UserProfile(Guid userId, string displayName)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        DisplayName = displayName;

        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid UserId { get; private set; }
    public string DisplayName { get; private set; } = default!;
    public string? AvatarUrl { get; private set; }

    public void UpdateDisplayName(string displayName)
    {
        DisplayName = displayName;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateAvatar(string? avatarUrl)
    {
        AvatarUrl = avatarUrl;
        UpdatedAt = DateTime.UtcNow;
    }
}
