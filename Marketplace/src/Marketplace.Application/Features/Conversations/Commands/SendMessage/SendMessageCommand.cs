using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.SendMessage;

public sealed record SendMessageCommand(Guid ConversationId, Guid SenderId, string Body)
    : IRequest<Result<SendMessageResponse>>;

public sealed record SendMessageResponse(
    Guid MessageId,
    Guid ConversationId,
    Guid SenderId,
    string Body,
    DateTime SentAt,
    DateTime? ReadAt
);

