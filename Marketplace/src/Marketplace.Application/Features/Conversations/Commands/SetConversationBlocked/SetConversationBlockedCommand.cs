using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.SetConversationBlocked;

public sealed record SetConversationBlockedCommand(
    Guid ConversationId,
    Guid UserId,
    bool IsBlocked
) : IRequest<Result<SetConversationBlockedResponse>>;

public sealed record SetConversationBlockedResponse(bool IsBlocked);
