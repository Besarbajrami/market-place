using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.PublishListing;

public sealed record PublishListingCommand(
    Guid ListingId,
    Guid SellerId
) : IRequest<Result<PublishListingResponse>>;

public sealed record PublishListingResponse(
    Guid ListingId,
    int Status,
    DateTime? PublishedAt
);
