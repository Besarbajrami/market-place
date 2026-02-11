using FluentValidation;

namespace Marketplace.Application.Features.Conversations.Commands.SendMessage;

public sealed class SendMessageCommandValidator : AbstractValidator<SendMessageCommand>
{
    public SendMessageCommandValidator()
    {
        RuleFor(x => x.ConversationId).NotEmpty();
        RuleFor(x => x.SenderId).NotEmpty();
        RuleFor(x => x.Body).NotEmpty().MaximumLength(2000);
    }
}
