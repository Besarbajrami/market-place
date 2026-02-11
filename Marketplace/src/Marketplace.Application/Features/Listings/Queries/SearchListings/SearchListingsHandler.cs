using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.SearchListings;

public sealed class SearchListingsQueryHandler
    : IRequestHandler<SearchListingsQuery, Result<SearchListingsResponse>>
{
    private readonly IListingRepository _repo;

    public SearchListingsQueryHandler(IListingRepository repo) => _repo = repo;

    public async Task<Result<SearchListingsResponse>> Handle(SearchListingsQuery request, CancellationToken ct)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize is < 1 ? 20 : request.PageSize > 100 ? 100 : request.PageSize;

        var (items, total) = await _repo.SearchAsync(
            request.Query, request.MinPrice, request.MaxPrice, page, pageSize, ct);

        return Result<SearchListingsResponse>.Success(
            new SearchListingsResponse(
                page,
                pageSize,
                total,
                items.Select(x => new ListingListItem(x.Id, x.Title, x.Price ?? 0)).ToList()
            ));
    }
}
