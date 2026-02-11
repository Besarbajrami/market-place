namespace Marketplace.Application.Common.Errors;

public static class ListingErrors
{
    public static readonly Error NotFound = new("Listing.NotFound", "Listing was not found.");
    public static readonly Error Forbidden = new("Listing.Forbidden", "You are not allowed to modify this listing.");
    public static readonly Error NotDraft = new("Listing.NotDraft", "This action is allowed only for Draft listings.");
    public static readonly Error TooManyImages = new("Listing.TooManyImages", "Too many images for this listing.");
    public static readonly Error BumpNotAllowed = new("Listing.BumpNotAllowed", "Listing cannot be bumped.");
    public static readonly Error CategoryNotLeaf = new("Listing.CategoryNotLeaf", "Only leaf categories can be used for listings.");
    public static Error PublishInvalid(string reason) =>
    new(
        Code: "Listing.PublishInvalid",
        Message: reason
    );


}
