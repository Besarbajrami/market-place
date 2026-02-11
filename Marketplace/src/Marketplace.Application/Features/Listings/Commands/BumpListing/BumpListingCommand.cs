using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.BumpListing;

public sealed record BumpListingCommand(Guid ListingId, Guid SellerId)
    : IRequest<Result<BumpListingResponse>>;

public sealed record BumpListingResponse(Guid ListingId, DateTime BumpedAt);
