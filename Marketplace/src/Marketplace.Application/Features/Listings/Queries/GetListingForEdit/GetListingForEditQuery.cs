using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.GetListingForEdit;

public sealed record GetListingForEditQuery(
    Guid ListingId,
    Guid SellerId
) : IRequest<Result<GetListingForEditResponse>>;
