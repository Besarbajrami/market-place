using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Favorites.Queries.GetMyFavorites;

public sealed class GetMyFavoritesQueryHandler
    : IRequestHandler<GetMyFavoritesQuery, Result<GetMyFavoritesResponse>>
{
    private readonly IFavoriteRepository _favorites;
    private readonly IListingRepository _listings;
    private readonly ICategoryRepository _categories;

    public GetMyFavoritesQueryHandler(IFavoriteRepository favorites, IListingRepository listings, ICategoryRepository categories)
    {
        _favorites = favorites;
        _listings = listings;
        _categories = categories;
    }

    public async Task<Result<GetMyFavoritesResponse>> Handle(GetMyFavoritesQuery request, CancellationToken ct)
    {
        var (rows, total) = await _favorites.GetForUserAsync(request.UserId, request.Page, request.PageSize, ct);

        var items = new List<FavoriteItemDto>(rows.Count);

        foreach (var fav in rows)
        {
            var row = await _listings.GetSearchRowAsync(fav.ListingId, ct);
            if (row is null)
                continue; // listing no longer published

            var label = await _categories.GetLabelAsync(row.CategoryId, request.Culture, ct);
            var now = DateTime.UtcNow;

            items.Add(new FavoriteItemDto(
         row.Id,
         row.Title,
         row.Price,
         row.Currency,
         row.City,
         row.Region,
         row.PublishedAt,
         row.CoverImageUrl,
         row.FeaturedUntil is not null && row.FeaturedUntil > now,
         row.UrgentUntil is not null && row.UrgentUntil > now,
         label?.Name ?? "",
         label?.Slug ?? "",
         fav.CreatedAt
     ));

        }

        return Result<GetMyFavoritesResponse>.Success(
            new(request.Page, request.PageSize, total, items)
        );
    }
}
