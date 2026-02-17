using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Application.Features.Admin.Listings.Queries;
using MediatR;

public sealed class SearchPendingListingsQueryHandler
    : IRequestHandler<SearchPendingListingsQuery, Result<SearchPendingListingsResponse>>
{
    private readonly IListingRepository _repo;

    public SearchPendingListingsQueryHandler(IListingRepository repo)
        => _repo = repo;

    public async Task<Result<SearchPendingListingsResponse>> Handle(
        SearchPendingListingsQuery request,
        CancellationToken ct)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize;

        var (items, total) = await _repo.SearchPendingAsync(page, pageSize, ct);

        var result = items.Select(l => new AdminPendingListingItem(
            l.Id,
            l.Title ?? "",
            l.SellerId.ToString(),
            l.CreatedAt,
            l.Images.Count
        )).ToList();

        return Result<SearchPendingListingsResponse>.Success(
            new(page, pageSize, total, result));
    }
}
