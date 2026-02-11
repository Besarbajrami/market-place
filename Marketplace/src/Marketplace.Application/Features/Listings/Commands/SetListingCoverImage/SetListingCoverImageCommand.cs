using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.SetListingCoverImage;

public sealed record SetListingCoverImageCommand(
    Guid ListingId,
    Guid SellerId,
    Guid ImageId
) : IRequest<Result<SetListingCoverImageResponse>>;

public sealed record SetListingCoverImageResponse(Guid ListingId, Guid ImageId);
