using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.DeleteMessageForMe;

public sealed class DeleteMessageForMeCommandHandler
    : IRequestHandler<DeleteMessageForMeCommand, Result<DeleteMessageForMeResponse>>
{
    private readonly IConversationRepository _conversations;
    private readonly IMessageRepository _messages;
    private readonly IUnitOfWork _uow;

    public DeleteMessageForMeCommandHandler(IConversationRepository conversations, IMessageRepository messages, IUnitOfWork uow)
    {
        _conversations = conversations;
        _messages = messages;
        _uow = uow;
    }

    public async Task<Result<DeleteMessageForMeResponse>> Handle(DeleteMessageForMeCommand request, CancellationToken ct)
    {
        var isParticipant = await _conversations.IsParticipantAsync(request.ConversationId, request.UserId, ct);
        if (!isParticipant)
            return Result<DeleteMessageForMeResponse>.Failure(new Error("Conversation.Forbidden", "You are not a participant of this conversation."));

        var msg = await _messages.GetByIdAsync(request.MessageId, ct);
        if (msg is null || msg.ConversationId != request.ConversationId)
            return Result<DeleteMessageForMeResponse>.Failure(new Error("Message.NotFound", "Message not found."));

        // Decide whether user is sender or receiver
        if (msg.SenderId == request.UserId)
            msg.DeleteForSender();
        else
            msg.DeleteForReceiver();

        await _uow.SaveChangesAsync(ct);
        return Result<DeleteMessageForMeResponse>.Success(new(request.MessageId));
    }
}
