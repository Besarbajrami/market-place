using MediatR;
using Marketplace.Application.Common.Results;
using Marketplace.Application.Features.Listings.Commands.UpdateDraftListing;

public sealed record UpdateListingBasicsCommand(
    Guid ListingId,
    string Title,
    string Description,
    decimal Price,
    string CountryCode,
    string Currency,
    string City,
    string Region,
    string Condition,
    Guid CategoryId,
    IReadOnlyList<ListingAttributeInput> Attributes
) : IRequest<Result<Unit>>;
