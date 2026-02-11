using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.UpdateDraftListing;

public sealed record UpdateDraftListingCommand(
    Guid ListingId,
    Guid SellerId,
    Guid CategoryId,
    string Title,
    string Description,
    decimal Price,
    string CountryCode,
    string Currency,
    string City,
    string? Region,
    string Condition
) : IRequest<Result<UpdateDraftListingResponse>>;

public sealed record UpdateDraftListingResponse(
    Guid ListingId,
    DateTime UpdatedAt
);
public sealed record ListingAttributeInput(
    Guid CategoryAttributeId,
    string Value);
