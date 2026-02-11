using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Application.Features.Listings.Queries.GetListingDetails;
using Marketplace.Domain.Entities;
using MediatR;
using static Marketplace.Application.Common.Interfaces.IListingRepository;

namespace Marketplace.Application.Features.Users.Queries.GetSellerListings;

public sealed class GetSellerListingsQueryHandler
    : IRequestHandler<GetSellerListingsQuery, Result<GetSellerListingsResponse>>
{
    private readonly IListingRepository _listings;
    private readonly ICategoryRepository _categories;
    private readonly ISellerReadService _sellerRead;

    public GetSellerListingsQueryHandler(
        IListingRepository listings,
        ICategoryRepository categories,
        ISellerReadService sellerRead)
    {
        _listings = listings;
        _categories = categories;
        _sellerRead = sellerRead;
    }

    public async Task<Result<GetSellerListingsResponse>> Handle(
        GetSellerListingsQuery request,
        CancellationToken ct)
    {
        /* ---------------------------------- */
        /* Load seller once                   */
        /* ---------------------------------- */

        var seller = await _sellerRead.GetSellerSummaryAsync(
            request.SellerId,
            ct);

        if (seller is null)
        {
          
                return Result<GetSellerListingsResponse>.Failure(ListingErrors.NotFound);
       
        }

        /* ---------------------------------- */
        /* Build search spec                  */
        /* ---------------------------------- */

        var spec = new ListingSellerSearchSpec(
            Page: request.Page,
            PageSize: request.PageSize,
            Sort: request.Sort,
            Status: null,
            IncludeHidden: false
        );

        /* ---------------------------------- */
        /* Query listings                     */
        /* ---------------------------------- */

        var (rows, total) = await _listings.SearchBySellerAsync(
            sellerId: request.SellerId,
            onlyPublic: true,
            spec: spec,
            ct: ct);

        /* ---------------------------------- */
        /* Map results                        */
        /* ---------------------------------- */

        var items = new List<SellerListingItemDto>(rows.Count);
        var now = DateTime.UtcNow;

        foreach (var r in rows)
        {
            var label = await _categories.GetLabelAsync(
                r.CategoryId,
                request.Culture,
                ct);

            items.Add(new SellerListingItemDto(
                r.Id,
                r.Title,
                r.Price,
                r.Currency,
                r.City,
                r.Region,
                r.PublishedAt,
                r.CoverImageUrl,
                r.FeaturedUntil is not null && r.FeaturedUntil > now,
                r.UrgentUntil is not null && r.UrgentUntil > now,
                label?.Name ?? "",
                label?.Slug ?? ""
            ));
        }

        /* ---------------------------------- */
        /* Return response                    */
        /* ---------------------------------- */

        return Result<GetSellerListingsResponse>.Success(
            new GetSellerListingsResponse(
                SellerId: seller.Id,
                SellerDisplayName: seller.DisplayName,
                Page: request.Page,
                PageSize: request.PageSize,
                TotalCount: total,
                Items: items
            ));
    }
}
