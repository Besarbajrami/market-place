using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.SetListingFeatured;

public sealed record SetListingFeaturedCommand(
    Guid ListingId,
    DateTime UntilUtc
) : IRequest<Result<SetListingFeaturedResponse>>;

public sealed record SetListingFeaturedResponse(Guid ListingId, DateTime FeaturedUntil);
