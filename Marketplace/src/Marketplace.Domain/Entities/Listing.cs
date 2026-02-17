using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Listing : BaseEntity
{
    private readonly List<ListingImage> _images = new();
    private readonly List<ListingAttributeValue> _attributes = new();

    public IReadOnlyCollection<ListingAttributeValue> Attributes => _attributes;

    private Listing() { } // EF

    public Listing(
        Guid sellerId,
        Guid categoryId,
        string title,
        string description,
        decimal price,
        string currency,
         string countryCode,
        string city,
        string region,
        string condition)
    {
        Id = Guid.NewGuid();
        SellerId = sellerId;
        CategoryId = categoryId;

        Title = title;
        Description = description;

        Price = price;
        Currency = currency;
        Condition = condition;
        LocationCountryCode = countryCode;
        LocationCity = city;
        LocationRegion = region;

        Status = ListingStatus.Draft;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid SellerId { get; private set; }
    public Guid CategoryId { get; private set; }

    public string? Title { get; private set; } = default!;
    public string? Description { get; private set; } = default!;

    public decimal? Price { get; private set; }
    public string? Currency { get; private set; } = "EUR";

    // Reklama5: new/used is usually a filter
    public string? Condition { get; private set; } = "used";

    public string? LocationCity { get; private set; } = default!;
    public string? LocationRegion { get; private set; } = default!;

    public ListingStatus Status { get; private set; }
    public DateTime? PublishedAt { get; private set; }
    public DateTime? SoldAt { get; private set; }
    public DateTime? ArchivedAt { get; private set; }
    public string? LocationCountryCode { get; private set; } = "MK"; // ISO-like: MK, AL, XK

    public int ViewCount { get; private set; }
    public ModerationStatus ModerationStatus { get; private set; } = ModerationStatus.Pending;

    public DateTime? HiddenAt { get; private set; }
    public string? HiddenReason { get; private set; }
    public int? ReportCount { get; private set; }
    public IReadOnlyCollection<ListingImage> Images => _images;
    public DateTime? FeaturedUntil { get; private set; }
    public DateTime? UrgentUntil { get; private set; }
    public DateTime? BumpedAt { get; private set; }
    public bool IsFeatured(DateTime nowUtc) => FeaturedUntil is not null && FeaturedUntil > nowUtc;
    public bool IsUrgent(DateTime nowUtc) => UrgentUntil is not null && UrgentUntil > nowUtc;

    public void UpdateBasics(
        string title,
        string description,
        decimal price,
            string countryCode,
        string currency,

        string city,
        string region,
        string condition,
        Guid categoryId)
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Only draft listings can be edited.");

        Title = title;
        Description = description;
        Price = price;
        Currency = currency;
        LocationCity = city;
        LocationRegion = region;
        Condition = condition;
        CategoryId = categoryId;
        LocationCountryCode = countryCode;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddImage(string url)
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Images can be changed only in Draft.");

        var nextOrder = _images.Count == 0 ? 1 : _images.Max(i => i.SortOrder) + 1;
        var isCover = _images.Count == 0; // first image becomes cover

        _images.Add(new ListingImage(this, url, isCover, nextOrder));

        UpdatedAt = DateTime.UtcNow;
    }

    public void SetCoverImage(Guid imageId)
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Cover can be changed only in Draft.");

        foreach (var img in _images)
            img.SetCover(img.Id == imageId);

        UpdatedAt = DateTime.UtcNow;
    }
    //public void PublishByAdmin()
    //{
    //    if (ModerationStatus != ModerationStatus.Pending)
    //        throw new InvalidOperationException("Listing must be pending review.");

    //    Status = ListingStatus.Published;
    //    ModerationStatus = ModerationStatus.Approved;

    //    PublishedAt = DateTime.UtcNow;
    //    UpdatedAt = PublishedAt.Value;
    //}

    //public void Publish()
    //{
    //    if (Status != ListingStatus.Draft)
    //        throw new InvalidOperationException("Only draft listings can be published.");

    //    if (!CanPublish())
    //        throw new InvalidOperationException(GetPublishInvalidReason());

    //    Status = ListingStatus.Published;
    //    ModerationStatus = ModerationStatus.Pending;

    //    PublishedAt = DateTime.UtcNow;
    //    UpdatedAt = PublishedAt.Value;
    //}

    //public void Approve()
    //{
    //    if (Status != ListingStatus.PendingReview)
    //        throw new InvalidOperationException("Listing is not under review.");

    //    Status = ListingStatus.Published;
    //    ModerationStatus = ModerationStatus.Approved;

    //    PublishedAt = DateTime.UtcNow;
    //    UpdatedAt = PublishedAt.Value;
    //}


    public void Reject(string reason)
    {
        ModerationStatus = ModerationStatus.Rejected;
        HiddenReason = reason;
        UpdatedAt = DateTime.UtcNow;
    }

 

    public void MarkSold()
    {
        if (Status != ListingStatus.Published)
            throw new InvalidOperationException("Only published listings can be sold.");
        var now = DateTime.UtcNow;

        Status = ListingStatus.Sold;
        SoldAt = DateTime.UtcNow;
        UpdatedAt = now;
    }

    public void Archive()
    {
        if (Status == ListingStatus.Archived) return;
        var now = DateTime.UtcNow;

        Status = ListingStatus.Archived;
        ArchivedAt = DateTime.UtcNow;
        UpdatedAt = now;
    }

    public void IncrementView()
    {
        ViewCount++;
    }
    public void ReorderImages(IReadOnlyList<Guid> orderedImageIds)
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Images can be reordered only in Draft.");

        if (orderedImageIds.Count != _images.Count)
            throw new InvalidOperationException("Invalid image list.");

        var set = orderedImageIds.ToHashSet();
        if (_images.Any(i => !set.Contains(i.Id)))
            throw new InvalidOperationException("Invalid image list.");

        for (int i = 0; i < orderedImageIds.Count; i++)
        {
            var id = orderedImageIds[i];
            var img = _images.First(x => x.Id == id);
            img.SetSortOrder(i + 1);
        }

        UpdatedAt = DateTime.UtcNow;
    }
    //public void MarkUnderReview()
    //{
    //    if (Status != ListingStatus.Draft)
    //        throw new InvalidOperationException("Only draft listings can be submitted.");

    //    ModerationStatus = ModerationStatus.UnderReview;
    //    UpdatedAt = DateTime.UtcNow;
    //}


    public void IncrementReportCount()
    {
        ReportCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Hide(string reason)
    {
        ModerationStatus = ModerationStatus.Hidden;
        HiddenAt = DateTime.UtcNow;
        HiddenReason = reason;
        UpdatedAt = HiddenAt.Value;
    }

    public void Unhide()
    {
        ModerationStatus = ModerationStatus.Pending;
        HiddenAt = null;
        HiddenReason = null;
        UpdatedAt = DateTime.UtcNow;
    }
    public void Bump(DateTime nowUtc, TimeSpan cooldown)
    {
        if (Status != ListingStatus.Published)
            throw new InvalidOperationException("Only published listings can be bumped.");

        if (BumpedAt is not null && (nowUtc - BumpedAt.Value) < cooldown)
            throw new InvalidOperationException("Bump cooldown not satisfied.");

        BumpedAt = nowUtc;
        UpdatedAt = nowUtc;
    }

    public void SetFeatured(DateTime untilUtc)
    {
        if (untilUtc <= DateTime.UtcNow)
            throw new InvalidOperationException("FeaturedUntil must be in the future.");

        FeaturedUntil = untilUtc;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetUrgent(DateTime untilUtc)
    {
        if (untilUtc <= DateTime.UtcNow)
            throw new InvalidOperationException("UrgentUntil must be in the future.");

        UrgentUntil = untilUtc;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ClearPromotions()
    {
        FeaturedUntil = null;
        UrgentUntil = null;
        UpdatedAt = DateTime.UtcNow;
    }
    public bool CanPublish()
    {
        return Status == ListingStatus.Draft
            && CategoryId != Guid.Empty
            && !string.IsNullOrWhiteSpace(Title)
            && !string.IsNullOrWhiteSpace(Description)
            //&& Price > 0
            && !string.IsNullOrWhiteSpace(Currency)
            && !string.IsNullOrWhiteSpace(LocationCity)
            //&& !string.IsNullOrWhiteSpace(LocationRegion)
            && Images.Any();
    }
    public string GetPublishInvalidReason()
    {
        if (Status != ListingStatus.Draft)
            return "Status is not Draft";

        if (CategoryId == Guid.Empty)
            return "Category is missing";

        if (string.IsNullOrWhiteSpace(Title))
            return "Title is missing";

        if (string.IsNullOrWhiteSpace(Description))
            return "Description is missing";

        //if (Price <= 0)
        //    return "Price must be greater than zero";

        if (string.IsNullOrWhiteSpace(Currency))
            return "Currency is missing";

        if (string.IsNullOrWhiteSpace(LocationCity))
            return "City is missing";

        //if (string.IsNullOrWhiteSpace(LocationRegion))
        //    return "Region is missing";

        if (Images == null || !Images.Any())
            return "At least one image is required";

        return "Unknown reason";
    }
    public static Listing CreateDraft(Guid sellerId)
    {
        return new Listing
        {
            Id = Guid.NewGuid(),
            SellerId = sellerId,
            Status = ListingStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };
    }
    public void SetAttributes(IEnumerable<(Guid categoryAttributeId, string value)> values)
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Attributes can be changed only in Draft.");

        _attributes.Clear();

        foreach (var (attributeId, value) in values)
        {
            if (string.IsNullOrWhiteSpace(value))
                continue;

            _attributes.Add(new ListingAttributeValue(Id, attributeId, value));
        }

        UpdatedAt = DateTime.UtcNow;
    }
    public void SubmitForReview()
    {
        if (Status != ListingStatus.Draft)
            throw new InvalidOperationException("Only draft listings can be submitted.");

        if (!CanPublish())
            throw new InvalidOperationException(GetPublishInvalidReason());

        Status = ListingStatus.PendingReview;
        ModerationStatus = ModerationStatus.Pending;
        UpdatedAt = DateTime.UtcNow;
    }


    public void ApproveAndPublish()
    {
        if (ModerationStatus != ModerationStatus.Pending)
            throw new InvalidOperationException("Listing is not pending review.");

        Status = ListingStatus.Published;
        ModerationStatus = ModerationStatus.Approved;
        PublishedAt = DateTime.UtcNow;
        UpdatedAt = PublishedAt.Value;
    }

    //private void TryAutoPublish()
    //{
    //    if (CanPublish())
    //    {
    //        Publish();
    //    }
    //}

}
