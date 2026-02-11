using FluentValidation;

namespace Marketplace.Application.Features.Listings.Commands.AddListingImage;

public sealed class AddListingImageCommandValidator : AbstractValidator<AddListingImageCommand>
{
    public AddListingImageCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.SellerId).NotEmpty();

        RuleFor(x => x.Url)
            .NotEmpty()
            .MaximumLength(2000)
            .Must(BeValidImagePath)
            .WithMessage("Url must be a valid image URL or relative path.");

    }

    private static bool BeValidImagePath(string url)
    {
        // Allow relative paths like /uploads/listings/...
        if (url.StartsWith("/"))
            return true;

        // Allow absolute http/https URLs (future S3, CDN, etc.)
        return Uri.TryCreate(url, UriKind.Absolute, out var u)
               && (u.Scheme == Uri.UriSchemeHttp || u.Scheme == Uri.UriSchemeHttps);
    }

}
