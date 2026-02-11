using Marketplace.Domain.Common;
using Marketplace.Domain.Entities;

public class ListingImage : BaseEntity
{
    private ListingImage() { } // EF

    public ListingImage(Listing listing, string url, bool isCover, int sortOrder)
    {
        Listing = listing;
        ListingId = listing.Id;
        Url = url;
        IsCover = isCover;
        SortOrder = sortOrder;
        CreatedAt = DateTime.UtcNow;
    }


    public Guid ListingId { get; private set; }

    public Listing Listing { get; private set; } = default!; // ✅ ADD THIS

    public string Url { get; private set; } = default!;
    public bool IsCover { get; private set; }
    public int SortOrder { get; private set; }

    public void SetCover(bool isCover) => IsCover = isCover;
    public void SetSortOrder(int sortOrder) => SortOrder = sortOrder;
}
