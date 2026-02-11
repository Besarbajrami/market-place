namespace Marketplace.Application.Common.Interfaces;

public interface IRealtimeNotifier
{
    Task NotifyConversationUpdatedAsync(Guid userId, Guid conversationId, CancellationToken ct = default);
}
