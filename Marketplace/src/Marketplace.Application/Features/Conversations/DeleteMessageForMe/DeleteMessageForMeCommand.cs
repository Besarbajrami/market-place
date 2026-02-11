using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.DeleteMessageForMe;

public sealed record DeleteMessageForMeCommand(
    Guid ConversationId,
    Guid MessageId,
    Guid UserId
) : IRequest<Result<DeleteMessageForMeResponse>>;

public sealed record DeleteMessageForMeResponse(Guid MessageId);
