using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Favorites.Queries.GetMyFavorites;

public sealed record GetMyFavoritesQuery(
    Guid UserId,
    string Culture,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<GetMyFavoritesResponse>>;

public sealed record FavoriteItemDto(
    Guid ListingId,
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
    string CategorySlug,
    DateTime FavoritedAt
);


public sealed record GetMyFavoritesResponse(
    int Page,
    int PageSize,
    int TotalCount,
    IReadOnlyList<FavoriteItemDto> Items
);
