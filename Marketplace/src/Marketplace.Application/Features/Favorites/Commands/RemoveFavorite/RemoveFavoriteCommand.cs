using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Favorites.Commands.RemoveFavorite;

public sealed record RemoveFavoriteCommand(Guid ListingId, Guid UserId)
    : IRequest<Result<RemoveFavoriteResponse>>;

public sealed record RemoveFavoriteResponse(Guid ListingId);
