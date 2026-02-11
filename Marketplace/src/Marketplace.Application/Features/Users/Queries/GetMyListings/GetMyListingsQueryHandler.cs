using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using MediatR;
using static Marketplace.Application.Common.Interfaces.IListingRepository;

namespace Marketplace.Application.Features.Users.Queries.GetMyListings;

public sealed class GetMyListingsQueryHandler
    : IRequestHandler<GetMyListingsQuery, Result<GetMyListingsResponse>>
{
    private readonly IListingRepository _listings;
    private readonly ICategoryRepository _categories;

    public GetMyListingsQueryHandler(IListingRepository listings, ICategoryRepository categories)
    {
        _listings = listings;
        _categories = categories;
    }

    public async Task<Result<GetMyListingsResponse>> Handle(GetMyListingsQuery request, CancellationToken ct)
    {
        var spec = new MyListingsSpec(
            request.Page,
            request.PageSize,
            request.Sort,
            request.Status,
            request.IncludeHidden
        );

        var (rows, total) = await _listings.SearchMyListingsAsync(request.UserId, spec, ct);

        var items = new List<MyListingItemDto>(rows.Count);

        foreach (var r in rows)
        {
            var label = await _categories.GetLabelAsync(r.CategoryId, request.Culture, ct);

            items.Add(new MyListingItemDto(
                r.Id,
                r.Title,
                r.Price,
                r.Currency,
                r.City,
                r.Region,
                r.CreatedAt,
                r.PublishedAt,
                r.Status,
                r.ModerationStatus,
                r.ReportCount,
                r.CoverImageUrl,
                label?.Name ?? "",
                label?.Slug ?? ""
            ));
        }

        return Result<GetMyListingsResponse>.Success(new(request.Page, request.PageSize, total, items));
    }
}
