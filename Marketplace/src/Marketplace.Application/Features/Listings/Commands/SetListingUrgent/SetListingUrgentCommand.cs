using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.SetListingUrgent;

public sealed record SetListingUrgentCommand(
    Guid ListingId,
    DateTime UntilUtc
) : IRequest<Result<SetListingUrgentResponse>>;

public sealed record SetListingUrgentResponse(Guid ListingId, DateTime UrgentUntil);
