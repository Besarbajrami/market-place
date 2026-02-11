using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetConversationMessages;

public sealed record GetConversationMessagesQuery(
    Guid ConversationId,
    Guid UserId,
    int Take = 50,
    DateTime? BeforeSentAt = null
) : IRequest<Result<GetConversationMessagesResponse>>;


public sealed record MessageItem(
    Guid MessageId,
    Guid SenderId,
    string Body,
    DateTime SentAt,
    DateTime? ReadAt
);

public sealed record GetConversationMessagesResponse(
    Guid ConversationId,
    IReadOnlyList<MessageItem> Items,
    DateTime? NextBeforeSentAt
);

