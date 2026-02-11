using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Users.Queries.GetSellerListings;

/* ---------------------------------- */
/* Query                              */
/* ---------------------------------- */

public sealed record GetSellerListingsQuery(
    Guid SellerId,
    string Culture,
    int Page = 1,
    int PageSize = 20,
    string Sort = "newest"
) : IRequest<Result<GetSellerListingsResponse>>;

/* ---------------------------------- */
/* DTOs                               */
/* ---------------------------------- */

public sealed record SellerListingItemDto(
    Guid Id,
    string Title,
    decimal Price,
    string Currency,
    string City,
    string Region,
    DateTime PublishedAt,
    string? CoverImageUrl,
    bool IsFeatured,
    bool IsUrgent,
    string CategoryName,
    string CategorySlug
);

/* ---------------------------------- */
/* Response                           */
/* ---------------------------------- */

public sealed record GetSellerListingsResponse(
    Guid SellerId,
    string SellerDisplayName,
    int Page,
    int PageSize,
    int TotalCount,
    IReadOnlyList<SellerListingItemDto> Items
);
