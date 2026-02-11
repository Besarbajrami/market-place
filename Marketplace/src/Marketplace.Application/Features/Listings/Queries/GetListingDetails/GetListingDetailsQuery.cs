using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.GetListingDetails;

public sealed record GetListingDetailsQuery(
    Guid ListingId,
    string Culture,
    Guid? ViewerUserId // null = public
) : IRequest<Result<GetListingDetailsResponse>>;

public sealed record ListingImageDto(
    Guid Id,
    string Url,
    bool IsCover,
    int SortOrder
);

public sealed record GetListingDetailsResponse(
    Guid Id,
    Guid SellerId,
    string Title,
    string Description,
    decimal Price,
    string Currency,
    string Condition,
    string City,
    string Region,
    int Status,
    DateTime? PublishedAt,
    bool IsFeatured,
    bool IsUrgent,
    DateTime? FeaturedUntil,
    DateTime? UrgentUntil,
    int ViewCount,
    CategoryDto Category,
    IReadOnlyList<ListingImageDto> Images,
    bool IsFavorite

);
public sealed record SellerSummaryDto(
    Guid Id,
    string DisplayName
);


public sealed record CategoryDto(Guid Id, string Name, string Slug);
