namespace Marketplace.Application.Features.Listings.Commands.UpdateListingBasics;

public sealed record ListingAttributeInput(
    Guid CategoryAttributeId,
    string Value);
