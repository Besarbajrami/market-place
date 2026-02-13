using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.SearchListingsV2;

public sealed record SearchListingsV2Query(
    string Culture,
    Guid? ViewerId, // ✅ REQUIRED
    string? Query,
    Guid? CategoryId,
    bool IncludeChildCategories,
    string? City,
    string? Region,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? Condition,
    string Sort,
    int Page,
    int PageSize,
    string? CountryCode
) : IRequest<Result<SearchListingsV2Response>>;

public sealed record ListingImagePreviewDto(
    Guid Id,
    string Url
);

public sealed record ListingSearchItem(
    Guid Id,
    string Title,
    decimal Price,
    string Currency,
    string City,
    string Region,
    DateTime? PublishedAt,
    string? CoverImageUrl,
    IReadOnlyList<ListingImagePreviewDto> Images, // ✅ NEW
    bool IsFeatured,
    bool IsUrgent,
    CategoryLabelDto Category,
    bool IsFavorite,
    string? CountryCode
);



public sealed record CategoryLabelDto(Guid Id, string Name, string Slug);

public sealed record SearchListingsV2Response(
    int Page,
    int PageSize,
    int TotalCount,
    IReadOnlyList<ListingSearchItem> Items
);
