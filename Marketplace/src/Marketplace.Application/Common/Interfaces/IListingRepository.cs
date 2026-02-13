using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;
public sealed record ListingImageRow(
    Guid Id,
    string Url
);
public interface IListingRepository
{

    Task AddAsync(Listing listing, CancellationToken ct = default);
    Task<Listing?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<(IReadOnlyList<Listing> Items, int TotalCount)> SearchAsync(
    string? query,
    decimal? minPrice,
    decimal? maxPrice,
    int page,
    int pageSize,
    CancellationToken ct = default);
    Task<bool> IsPublishedAsync(Guid listingId, CancellationToken ct = default);
    Task<ListingSearchRow?> GetSearchRowAsync(Guid listingId, CancellationToken ct = default);
    Task<Listing?> GetForPublishAsync(Guid listingId, CancellationToken ct = default);
    Task<Listing?> GetByIdWithAttributesAsync(
    Guid listingId,
    CancellationToken ct = default);

    Task<Guid?> GetSellerIdAsync(Guid listingId, CancellationToken ct = default);
    Task<Listing?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default);
    Task IncrementViewAsync(Guid listingId, CancellationToken ct = default);
    Task<(IReadOnlyList<ListingSearchRow> Items, int TotalCount)> SearchPublishedAsync(
    ListingSearchSpec spec,
    CancellationToken ct = default);
    public sealed record ListingSearchSpec(
    string? Query,
    IReadOnlyCollection<Guid>? CategoryIds,
    string? City,
    string? Region,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? Condition,
    string Sort,
    int Page,
    int PageSize,
    string? CountryCode
);

    public sealed record ListingSearchRow(
        Guid Id,
        string Title,
        decimal Price,
        string Currency,
        string City,
        string? Region,
        DateTime PublishedAt,
        Guid CategoryId,
        string? CoverImageUrl,
         IReadOnlyList<ListingImageRow> Images, // ✅ NEW
        DateTime? FeaturedUntil,
        DateTime? UrgentUntil,
        string CountryCode
    );

    Task<(IReadOnlyList<ListingSearchRow> Items, int TotalCount)> SearchBySellerAsync(
    Guid sellerId,
    bool onlyPublic,
    ListingSellerSearchSpec spec,
    CancellationToken ct = default);
    public sealed record ListingSellerSearchSpec(
        int Page,
        int PageSize,
        string Sort,        // newest | price_asc | price_desc
        int? Status,        // null means "all" (for /me), but for public we'll always use Published
        bool IncludeHidden  // for /me true, for public false
    );
    Task<(IReadOnlyList<MyListingRow> Items, int TotalCount)> SearchMyListingsAsync(
    Guid sellerId,
    MyListingsSpec spec,
    CancellationToken ct = default);
    public sealed record MyListingsSpec(
    int Page,
    int PageSize,
    string Sort,
    int? Status,
    bool IncludeHidden
);

    public sealed record MyListingRow(
        Guid Id,
        string Title,
        decimal Price,
        string Currency,
        string City,
        string? Region,
        DateTime CreatedAt,
        DateTime? PublishedAt,
        int Status,
        int ModerationStatus,
        int ReportCount,
        Guid CategoryId,
        string? CoverImageUrl,
        string? CountryCode
    );

}
