using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetConversationMessages;

public sealed class GetConversationMessagesQueryHandler
    : IRequestHandler<GetConversationMessagesQuery, Result<GetConversationMessagesResponse>>
{
    private readonly IConversationRepository _conversations;
    private readonly IMessageRepository _messages;

    public GetConversationMessagesQueryHandler(IConversationRepository conversations, IMessageRepository messages)
    {
        _conversations = conversations;
        _messages = messages;
    }

    public async Task<Result<GetConversationMessagesResponse>> Handle(GetConversationMessagesQuery request, CancellationToken ct)
    {
        var isParticipant = await _conversations.IsParticipantAsync(request.ConversationId, request.UserId, ct);
        if (!isParticipant)
            return Result<GetConversationMessagesResponse>.Failure(new Error("Conversation.Forbidden", "You are not a participant of this conversation."));

        var msgs = await _messages.GetByConversationAsync(
        request.ConversationId,
        request.UserId,
        request.Take,
        request.BeforeSentAt,
        ct);

        var items = msgs.Select(m => new MessageItem(
            m.Id,
            m.SenderId,
            m.Body,
            m.SentAt,
            m.ReadAt
        )).ToList();
        DateTime? next = items.Count == 0 ? null : items.Min(x => x.SentAt);

        return Result<GetConversationMessagesResponse>.Success(
         new(request.ConversationId, items, next)
     );

    }
}
