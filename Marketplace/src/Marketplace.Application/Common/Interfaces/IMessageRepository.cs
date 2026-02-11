using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface IMessageRepository
{
    Task AddAsync(Message message, CancellationToken ct = default);
    Task<IReadOnlyList<Message>> GetByConversationAsync(
        Guid conversationId,
        Guid viewerUserId,
        int take,
        DateTime? beforeSentAt,
        CancellationToken ct = default);
    Task<Message?> GetByIdAsync(Guid messageId, CancellationToken ct = default);
    Task<int> MarkAsReadAsync(Guid conversationId, Guid readerUserId, CancellationToken ct = default);
    Task<IReadOnlyList<Message>> GetByConversationPageAsync(
    Guid conversationId,
    Guid viewerUserId,
    int take,
    Guid? beforeMessageId,
    CancellationToken ct = default);
    Task<int> DeleteForUserAsync(Guid messageId, Guid userId, CancellationToken ct = default);

}
