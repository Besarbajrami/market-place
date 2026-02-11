using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.SetConversationBlocked;

public sealed class SetConversationBlockedCommandHandler
    : IRequestHandler<SetConversationBlockedCommand, Result<SetConversationBlockedResponse>>
{
    private readonly IConversationRepository _conversations;
    private readonly IUnitOfWork _uow;

    public SetConversationBlockedCommandHandler(IConversationRepository conversations, IUnitOfWork uow)
    {
        _conversations = conversations;
        _uow = uow;
    }

    public async Task<Result<SetConversationBlockedResponse>> Handle(SetConversationBlockedCommand request, CancellationToken ct)
    {
        var isParticipant = await _conversations.IsParticipantAsync(request.ConversationId, request.UserId, ct);
        if (!isParticipant)
            return Result<SetConversationBlockedResponse>.Failure(new Error("Conversation.Forbidden", "You are not a participant of this conversation."));

        await _conversations.SetBlockedAsync(request.ConversationId, request.IsBlocked, ct);
        await _uow.SaveChangesAsync(ct);

        return Result<SetConversationBlockedResponse>.Success(new(request.IsBlocked));
    }
}
