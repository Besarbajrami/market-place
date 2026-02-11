using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.MarkConversationRead;

public sealed record MarkConversationReadCommand(
    Guid ConversationId,
    Guid UserId
) : IRequest<Result<MarkConversationReadResponse>>;

public sealed record MarkConversationReadResponse(Guid ConversationId);
