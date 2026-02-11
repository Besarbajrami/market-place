using FluentValidation;

namespace Marketplace.Application.Features.Conversations.Commands.SetConversationBlocked;

public sealed class SetConversationBlockedCommandValidator : AbstractValidator<SetConversationBlockedCommand>
{
    public SetConversationBlockedCommandValidator()
    {
        RuleFor(x => x.ConversationId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
