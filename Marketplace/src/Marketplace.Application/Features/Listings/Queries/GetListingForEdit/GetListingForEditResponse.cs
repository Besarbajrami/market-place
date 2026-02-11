namespace Marketplace.Application.Features.Listings.Queries.GetListingForEdit;

public sealed record GetListingForEditResponse(
    Guid Id,
    Guid CategoryId,
    string Title,
    string Description,
    decimal Price,
    string Currency,
    string City,
    string Region,
    string Condition,
    int Status,
    IReadOnlyList<ListingAttributeValueDto> Attributes
);
public sealed record ListingAttributeValueDto(
    Guid CategoryAttributeId,
    string Value
);