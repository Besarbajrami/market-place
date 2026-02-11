using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.SearchListings;

public sealed record SearchListingsQuery(
    string? Query,
    decimal? MinPrice,
    decimal? MaxPrice,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<SearchListingsResponse>>;

public sealed record ListingListItem(Guid Id, string Title, decimal Price);

public sealed record SearchListingsResponse(
    int Page,
    int PageSize,
    int TotalCount,
    IReadOnlyList<ListingListItem> Items
);
