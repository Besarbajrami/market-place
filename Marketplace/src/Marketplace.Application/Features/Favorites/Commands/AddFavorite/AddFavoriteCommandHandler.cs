using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Features.Favorites.Commands.AddFavorite;

public sealed class AddFavoriteCommandHandler
    : IRequestHandler<AddFavoriteCommand, Result<AddFavoriteResponse>>
{
    private readonly IFavoriteRepository _favorites;
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public AddFavoriteCommandHandler(IFavoriteRepository favorites, IListingRepository listings, IUnitOfWork uow)
    {
        _favorites = favorites;
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<AddFavoriteResponse>> Handle(AddFavoriteCommand request, CancellationToken ct)
    {
        var isPublished = await _listings.IsPublishedAsync(request.ListingId, ct);
        if (!isPublished)
            return Result<AddFavoriteResponse>.Failure(new Error("Favorite.ListingNotPublished", "Listing is not published."));

        var existing = await _favorites.GetAsync(request.UserId, request.ListingId, ct);
        if (existing is not null)
            return Result<AddFavoriteResponse>.Success(new(request.ListingId)); // idempotent

        await _favorites.AddAsync(new Favorite(request.UserId, request.ListingId), ct);
        await _uow.SaveChangesAsync(ct);

        return Result<AddFavoriteResponse>.Success(new(request.ListingId));
    }
}
