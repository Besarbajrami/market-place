using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.BumpListing;

public sealed class BumpListingCommandValidator : AbstractValidator<BumpListingCommand>
{
    public BumpListingCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.SellerId).NotEmpty();
    }
}
