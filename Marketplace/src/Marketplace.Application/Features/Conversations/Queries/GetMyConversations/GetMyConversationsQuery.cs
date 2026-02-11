using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetMyConversations;

public sealed record GetMyConversationsQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<GetMyConversationsResponse>>;

public sealed record ConversationListItem(
    Guid ConversationId,
    Guid ListingId,
    Guid SellerId,
    Guid BuyerId,
    DateTime LastMessageAt,
    bool IsBlocked
);

public sealed record GetMyConversationsResponse(
    int Page,
    int PageSize,
    IReadOnlyList<ConversationListItem> Items
);
