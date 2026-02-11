using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.PublishListing;

public sealed class PublishListingCommandValidator : AbstractValidator<PublishListingCommand>
{
    public PublishListingCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.SellerId).NotEmpty();
    }
}
