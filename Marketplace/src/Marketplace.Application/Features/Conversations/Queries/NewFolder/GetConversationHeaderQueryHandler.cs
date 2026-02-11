using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetConversationHeader;

public sealed class GetConversationHeaderQueryHandler
    : IRequestHandler<GetConversationHeaderQuery, Result<GetConversationHeaderResponse>>
{
    private readonly IConversationRepository _conversations;

    public GetConversationHeaderQueryHandler(IConversationRepository conversations)
    {
        _conversations = conversations;
    }

    public async Task<Result<GetConversationHeaderResponse>> Handle(
        GetConversationHeaderQuery request,
        CancellationToken ct)
    {
        var header = await _conversations.GetHeaderAsync(
            request.ConversationId,
            request.UserId,
            ct);

        if (header is null)
            return Result<GetConversationHeaderResponse>.Failure(
                new Error("Conversation.NotFound", "Conversation not found.")
            );

        return Result<GetConversationHeaderResponse>.Success(
            new GetConversationHeaderResponse(
                header.ConversationId,
                header.ListingId,
                header.ListingTitle,
                header.Price,
                header.Currency
            )
        );
    }
}
