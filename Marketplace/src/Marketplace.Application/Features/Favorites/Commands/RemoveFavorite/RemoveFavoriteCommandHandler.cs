using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Favorites.Commands.RemoveFavorite;

public sealed class RemoveFavoriteCommandHandler
    : IRequestHandler<RemoveFavoriteCommand, Result<RemoveFavoriteResponse>>
{
    private readonly IFavoriteRepository _favorites;
    private readonly IUnitOfWork _uow;

    public RemoveFavoriteCommandHandler(IFavoriteRepository favorites, IUnitOfWork uow)
    {
        _favorites = favorites;
        _uow = uow;
    }

    public async Task<Result<RemoveFavoriteResponse>> Handle(RemoveFavoriteCommand request, CancellationToken ct)
    {
        var existing = await _favorites.GetAsync(request.UserId, request.ListingId, ct);
        if (existing is null)
            return Result<RemoveFavoriteResponse>.Success(new(request.ListingId)); // idempotent

        _favorites.Remove(existing);
        await _uow.SaveChangesAsync(ct);

        return Result<RemoveFavoriteResponse>.Success(new(request.ListingId));
    }
}
