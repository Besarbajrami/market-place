using Microsoft.AspNetCore.SignalR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Api.Hubs;

namespace Marketplace.Api.Common;

public sealed class RealtimeNotifier : IRealtimeNotifier
{
    private readonly IHubContext<ChatHub> _hub;

    public RealtimeNotifier(IHubContext<ChatHub> hub)
    {
        _hub = hub;
    }

    public Task NotifyConversationUpdatedAsync(Guid userId, Guid conversationId, CancellationToken ct = default)
    {
        return _hub.Clients.Group($"user:{userId}")
            .SendAsync("conversation:updated", new { conversationId }, ct);
    }
}
