using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.GetListingById;

public sealed record GetListingByIdQuery(Guid Id)
    : IRequest<Result<GetListingByIdResponse>>;

public sealed record GetListingByIdResponse(
    Guid Id,
    Guid SellerId,
    string Title,
    decimal Price,
    int Status
);
