using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetMyConversations;

public sealed class GetMyConversationsQueryHandler
    : IRequestHandler<GetMyConversationsQuery, Result<GetMyConversationsResponse>>
{
    private readonly IConversationRepository _repo;

    public GetMyConversationsQueryHandler(IConversationRepository repo) => _repo = repo;

    public async Task<Result<GetMyConversationsResponse>> Handle(GetMyConversationsQuery request, CancellationToken ct)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize > 100 ? 100 : request.PageSize;

        var conversations = await _repo.GetForUserAsync(request.UserId, page, pageSize, ct);

        var items = conversations.Select(c => new ConversationListItem(
            c.Id,
            c.ListingId,
            c.SellerId,
            c.BuyerId,
            c.LastMessageAt,
            c.IsBlocked
        )).ToList();

        return Result<GetMyConversationsResponse>.Success(new(page, pageSize, items));
    }
}
