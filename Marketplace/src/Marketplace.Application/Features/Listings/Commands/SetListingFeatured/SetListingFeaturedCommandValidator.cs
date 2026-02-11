using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.SetListingFeatured;

public sealed class SetListingFeaturedCommandValidator : AbstractValidator<SetListingFeaturedCommand>
{
    public SetListingFeaturedCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.UntilUtc).GreaterThan(DateTime.UtcNow);
    }
}
