using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.CreateListing;

public sealed class CreateListingCommandValidator
    : AbstractValidator<CreateListingCommand>
{
    public CreateListingCommandValidator()
    {
        RuleFor(x => x.SellerId)
            .NotEmpty();

        RuleFor(x => x.CategoryId)
            .NotEmpty();

        RuleFor(x => x.Title)
            .NotEmpty()
            .MinimumLength(5)
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .NotEmpty()
            .MinimumLength(20)
            .MaximumLength(6000);

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Currency)
            .NotEmpty()
            .Length(3); // EUR, MKD, etc.

        RuleFor(x => x.City)
            .NotEmpty()
            .MaximumLength(100);

        //RuleFor(x => x.Region)
        //    .NotEmpty()
        //    .MaximumLength(100);

        //RuleFor(x => x.Condition)
        //    .NotEmpty()
        //    .Must(v => v == "new" || v == "used")
        //    .WithMessage("Condition must be 'new' or 'used'.");
    }
}
