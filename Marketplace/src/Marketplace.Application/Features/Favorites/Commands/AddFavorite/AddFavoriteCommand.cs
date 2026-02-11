using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Favorites.Commands.AddFavorite;

public sealed record AddFavoriteCommand(Guid ListingId, Guid UserId)
    : IRequest<Result<AddFavoriteResponse>>;

public sealed record AddFavoriteResponse(Guid ListingId);
