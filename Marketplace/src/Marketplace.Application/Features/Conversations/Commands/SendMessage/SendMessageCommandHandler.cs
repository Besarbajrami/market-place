using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using MediatR;

namespace Marketplace.Application.Features.Conversations.Commands.SendMessage;

public sealed class SendMessageCommandHandler
    : IRequestHandler<SendMessageCommand, Result<SendMessageResponse>>
{
    private readonly IConversationRepository _conversations;
    private readonly IUnitOfWork _uow;
    private readonly IRealtimeNotifier _notifier;

    public SendMessageCommandHandler(IConversationRepository conversations, IUnitOfWork uow, IRealtimeNotifier notifier)
    {
        _conversations = conversations;
        _uow = uow;
        _notifier = notifier;
    }

    public async Task<Result<SendMessageResponse>> Handle(
        SendMessageCommand request,
        CancellationToken ct)
    {
        var convo = await _conversations.GetByIdAsync(request.ConversationId, ct);
        if (convo is null)
            return Result<SendMessageResponse>.Failure(
                new Error("Conversation.NotFound", "Conversation not found.")
            );

        var now = DateTime.UtcNow;

        // 1️⃣ Create message in domain
        var msg = convo.AddMessage(request.SenderId, request.Body);

        // 2️⃣ Explicitly persist message (THIS WAS MISSING)
        await _conversations.AddMessageAsync(msg, ct);

        // 3️⃣ SQL updates (safe, no tracking)
        await _conversations.MarkReadAsync(convo.Id, request.SenderId, now, ct);
        await _conversations.TouchAsync(convo.Id, now, ct);

        // 4️⃣ Persist message insert
        await _uow.SaveChangesAsync(ct);

        // 5️⃣ Realtime notifications
        await _notifier.NotifyConversationUpdatedAsync(convo.SellerId, convo.Id, ct);
        await _notifier.NotifyConversationUpdatedAsync(convo.BuyerId, convo.Id, ct);

        return Result<SendMessageResponse>.Success(
            new SendMessageResponse(
                msg.Id,
                msg.ConversationId,
                msg.SenderId,
                msg.Body,
                msg.SentAt,
                msg.ReadAt
            )
        );
    }

}
