using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> FindAsync(Guid listingId, Guid sellerId, Guid buyerId, CancellationToken ct = default);
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task AddAsync(Conversation conversation, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetForUserAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
    Task<bool> IsParticipantAsync(Guid conversationId, Guid userId, CancellationToken ct = default);
    Task SetBlockedAsync(Guid conversationId, bool isBlocked, CancellationToken ct = default);
    Task MarkReadAsync(Guid conversationId, Guid userId, DateTime nowUtc, CancellationToken ct = default);
    Task TouchAsync(Guid conversationId, DateTime now, CancellationToken ct);
    Task AddMessageAsync(Message message, CancellationToken ct = default);
    Task<ConversationHeaderDto?> GetHeaderAsync(
    Guid conversationId,
    Guid userId,
    CancellationToken ct = default);

    Task<(IReadOnlyList<ConversationInboxRow> Items, int Total)> GetInboxAsync(
    Guid userId,
    int page,
    int pageSize,
    CancellationToken ct = default);
    public sealed record ConversationInboxRow(
        Guid ConversationId,
        Guid ListingId,
        string ListingTitle,
        decimal ListingPrice,
        string ListingCurrency,
        Guid OtherUserId,
        DateTime UpdatedAt,
        string? LastMessageText,
        DateTime? LastMessageAt,
        int UnreadCount
    );

    public sealed record ConversationHeaderDto(
    Guid ConversationId,
    Guid ListingId,
    string ListingTitle,
    decimal Price,
    string Currency
);


}
