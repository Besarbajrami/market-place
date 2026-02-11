using FluentValidation;

namespace Marketplace.Application.Features.Conversations.Commands.CreateOrGetConversation;

public sealed class CreateOrGetConversationCommandValidator : AbstractValidator<CreateOrGetConversationCommand>
{
    public CreateOrGetConversationCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.BuyerId).NotEmpty();
    }
}
