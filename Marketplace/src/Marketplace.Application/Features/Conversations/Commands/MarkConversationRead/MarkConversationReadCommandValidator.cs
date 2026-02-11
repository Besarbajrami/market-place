using FluentValidation;

namespace Marketplace.Application.Features.Conversations.Commands.MarkConversationRead;

public sealed class MarkConversationReadCommandValidator : AbstractValidator<MarkConversationReadCommand>
{
    public MarkConversationReadCommandValidator()
    {
        RuleFor(x => x.ConversationId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
