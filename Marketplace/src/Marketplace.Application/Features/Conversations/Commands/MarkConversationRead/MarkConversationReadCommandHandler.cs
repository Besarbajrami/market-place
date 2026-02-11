using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.MarkConversationRead;

public sealed class MarkConversationReadCommandHandler
    : IRequestHandler<MarkConversationReadCommand, Result<MarkConversationReadResponse>>
{
    private readonly IConversationRepository _conversations;
    private readonly IMessageRepository _messages;
    private readonly IUnitOfWork _uow;

    public MarkConversationReadCommandHandler(IConversationRepository conversations, IMessageRepository messages, IUnitOfWork uow)
    {
        _conversations = conversations;
        _messages = messages;
        _uow = uow;
    }

    public async Task<Result<MarkConversationReadResponse>> Handle(MarkConversationReadCommand request, CancellationToken ct)
    {
        var convo = await _conversations.GetByIdAsync(request.ConversationId, ct);
        if (convo is null)
            return Result<MarkConversationReadResponse>.Failure(ConversationErrors.NotFound);

        if (convo.SellerId != request.UserId && convo.BuyerId != request.UserId)
            return Result<MarkConversationReadResponse>.Failure(ConversationErrors.Forbidden);

        var now = DateTime.UtcNow;

        // 1) update per-user read marker
        await _conversations.MarkReadAsync(request.ConversationId, request.UserId, now, ct);

        // 2) keep your existing readAt on messages (optional but useful)
        await _messages.MarkAsReadAsync(request.ConversationId, request.UserId, ct);

        await _uow.SaveChangesAsync(ct);

        return Result<MarkConversationReadResponse>.Success(new(request.ConversationId));
    }
}
