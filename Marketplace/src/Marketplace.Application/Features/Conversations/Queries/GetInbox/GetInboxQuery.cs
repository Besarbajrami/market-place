using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetInbox;

public sealed record GetInboxQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 20
) : IRequest<Result<GetInboxResponse>>;

public sealed record InboxUserDto(Guid UserId, string DisplayName, string? AvatarUrl);

public sealed record InboxItemDto(
    Guid ConversationId,
    Guid ListingId,
    InboxUserDto OtherUser,
    DateTime UpdatedAt,
    string? LastMessageText,
    DateTime? LastMessageAt,
    int UnreadCount
);


public sealed record GetInboxResponse(
    int Page,
    int PageSize,
    int TotalCount,
    IReadOnlyList<InboxItemDto> Items
);
