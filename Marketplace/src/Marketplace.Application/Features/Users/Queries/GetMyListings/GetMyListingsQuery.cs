using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Users.Queries.GetMyListings;

public sealed record GetMyListingsQuery(
    Guid UserId,
    string Culture,
    int Page = 1,
    int PageSize = 20,
    string Sort = "newest",
    int? Status = null,     // optional filter
    bool IncludeHidden = true
) : IRequest<Result<GetMyListingsResponse>>;

public sealed record MyListingItemDto(
    Guid Id,
    string Title,
    decimal Price,
    string Currency,
    string City,
    string Region,
    DateTime CreatedAt,
    DateTime? PublishedAt,
    int Status,
    int ModerationStatus,
    int ReportCount,
    string? CoverImageUrl,
    string CategoryName,
    string CategorySlug
);

public sealed record GetMyListingsResponse(
    int Page,
    int PageSize,
    int TotalCount,
    IReadOnlyList<MyListingItemDto> Items
);
