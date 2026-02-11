using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetInbox;

public sealed class GetInboxQueryHandler
    : IRequestHandler<GetInboxQuery, Result<GetInboxResponse>>
{
    private readonly IConversationRepository _conversations;
    private readonly IUserDirectory _users;

    public GetInboxQueryHandler(IConversationRepository conversations, IUserDirectory users)
    {
        _conversations = conversations;
        _users = users;
    }

    public async Task<Result<GetInboxResponse>> Handle(GetInboxQuery request, CancellationToken ct)
    {
        var (rows, total) = await _conversations.GetInboxAsync(request.UserId, request.Page, request.PageSize, ct);

        var otherUserIds = rows.Select(r => r.OtherUserId).Distinct().ToList();
        var summaries = await _users.GetSummariesAsync(otherUserIds, ct);

        var items = rows.Select(r =>
        {
            summaries.TryGetValue(r.OtherUserId, out var summary);

            var other = summary is null
                ? new InboxUserDto(r.OtherUserId, "User", null)
                : new InboxUserDto(summary.UserId, summary.DisplayName, summary.AvatarUrl);

            return new InboxItemDto(
                r.ConversationId,
                r.ListingId,
                other,
                r.UpdatedAt,
                r.LastMessageText,
                r.LastMessageAt,
                r.UnreadCount
            );
        }).ToList();

        return Result<GetInboxResponse>.Success(new(request.Page, request.PageSize, total, items));
    }
}
