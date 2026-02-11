using FluentValidation;

namespace Marketplace.Application.Features.Conversations.Commands.DeleteMessageForMe;

public sealed class DeleteMessageForMeCommandValidator : AbstractValidator<DeleteMessageForMeCommand>
{
    public DeleteMessageForMeCommandValidator()
    {
        RuleFor(x => x.ConversationId).NotEmpty();
        RuleFor(x => x.MessageId).NotEmpty();
        RuleFor(x => x.UserId).NotEmpty();
    }
}
