using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.SetListingCoverImage;

public sealed class SetListingCoverImageCommandValidator : AbstractValidator<SetListingCoverImageCommand>
{
    public SetListingCoverImageCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.SellerId).NotEmpty();
        RuleFor(x => x.ImageId).NotEmpty();
    }
}
