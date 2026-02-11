using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.SetListingUrgent;

public sealed class SetListingUrgentCommandValidator : AbstractValidator<SetListingUrgentCommand>
{
    public SetListingUrgentCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.UntilUtc).GreaterThan(DateTime.UtcNow);
    }
}
