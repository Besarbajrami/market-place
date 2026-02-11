using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class Favorite : BaseEntity
{
    private Favorite() { } // EF

    public Favorite(Guid userId, Guid listingId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        ListingId = listingId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid UserId { get; private set; }
    public Guid ListingId { get; private set; }
}
