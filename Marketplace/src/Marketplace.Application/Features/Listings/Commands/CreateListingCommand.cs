using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.CreateListing;

public sealed record CreateListingCommand(
    Guid SellerId,
    Guid CategoryId,
    string Title,
    string Description,
    decimal Price,
    string CountryCode,
    string Currency,
    string City,
    string Region,
    string Condition
) : IRequest<Result<CreateListingResponse>>;

public sealed record CreateListingResponse(
    Guid Id,
    int Status
);
