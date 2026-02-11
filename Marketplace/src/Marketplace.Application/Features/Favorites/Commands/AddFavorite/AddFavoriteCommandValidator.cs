using FluentValidation;

namespace Marketplace.Application.Features.Favorites.Commands.AddFavorite;

public sealed class AddFavoriteCommandValidator : AbstractValidator<AddFavoriteCommand>
{
    public AddFavoriteCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
