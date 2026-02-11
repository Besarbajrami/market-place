using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class ListingAttributeValue : BaseEntity
{
    private ListingAttributeValue() { }

    public ListingAttributeValue(Guid listingId, Guid categoryAttributeId, string value)
    {
        Id = Guid.NewGuid();
        ListingId = listingId;
        CategoryAttributeId = categoryAttributeId;
        Value = value;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid ListingId { get; private set; }
    public Guid CategoryAttributeId { get; private set; }
    public string Value { get; private set; } = default!;

    public void UpdateValue(string value)
    {
        Value = value;
        UpdatedAt = DateTime.UtcNow;
    }
}
