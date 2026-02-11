using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class MessageRepository : IMessageRepository
{
    private readonly MarketplaceDbContext _db;
    public MessageRepository(MarketplaceDbContext db) => _db = db;

    public Task AddAsync(Message message, CancellationToken ct = default)
        => _db.Messages.AddAsync(message, ct).AsTask();

    public async Task<IReadOnlyList<Message>> GetByConversationAsync(Guid conversationId, Guid viewerUserId, int take, CancellationToken ct = default)
    {
        take = take is < 1 ? 50 : take > 200 ? 200 : take;

        return await _db.Messages
            .Where(m => m.ConversationId == conversationId)
            .Where(m =>
                // if viewer is sender, hide if deleted by sender
                (m.SenderId == viewerUserId && !m.IsDeletedBySender)
                ||
                // if viewer is receiver, hide if deleted by receiver
                (m.SenderId != viewerUserId && !m.IsDeletedByReceiver)
            )
            .OrderByDescending(m => m.SentAt)
            .Take(take)
            .OrderBy(m => m.SentAt)
            .ToListAsync(ct);
    }

    public Task<Message?> GetByIdAsync(Guid messageId, CancellationToken ct = default)
    {
        return _db.Messages.FirstOrDefaultAsync(m => m.Id == messageId, ct);
    }
    public async Task<int> MarkAsReadAsync(Guid conversationId, Guid readerUserId, CancellationToken ct = default)
    {
        // Mark as read any messages in this conversation that are NOT sent by the reader and not already read
        return await _db.Messages
            .Where(m => m.ConversationId == conversationId && m.SenderId != readerUserId && m.ReadAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.ReadAt, _ => DateTime.UtcNow), ct);
    }
    public async Task<IReadOnlyList<Message>> GetByConversationPageAsync(
    Guid conversationId,
    Guid viewerUserId,
    int take,
    Guid? beforeMessageId,
    CancellationToken ct = default)
    {
        take = take is < 1 ? 50 : take > 200 ? 200 : take;

        // base query: messages in conversation, respecting per-user delete
        var q = _db.Messages
            .Where(m => m.ConversationId == conversationId)
            .Where(m =>
                (m.SenderId == viewerUserId && !m.IsDeletedBySender) ||
                (m.SenderId != viewerUserId && !m.IsDeletedByReceiver));

        // cursor: load messages older than the cursor message
        if (beforeMessageId is not null)
        {
            var cursorSentAt = await _db.Messages
                .Where(m => m.Id == beforeMessageId.Value)
                .Select(m => (DateTime?)m.SentAt)
                .FirstOrDefaultAsync(ct);

            if (cursorSentAt is not null)
            {
                q = q.Where(m => m.SentAt < cursorSentAt.Value);
            }
        }

        // return oldest->newest for UI
        return await q
            .OrderByDescending(m => m.SentAt)
            .Take(take)
            .OrderBy(m => m.SentAt)
            .ToListAsync(ct);
    }
    public async Task<int> DeleteForUserAsync(Guid messageId, Guid userId, CancellationToken ct = default)
    {
        // If user is sender => mark IsDeletedBySender
        // else => mark IsDeletedByReceiver
        var msg = await _db.Messages
            .Where(m => m.Id == messageId)
            .Select(m => new { m.Id, m.SenderId })
            .FirstOrDefaultAsync(ct);

        if (msg is null)
            return 0;

        if (msg.SenderId == userId)
        {
            return await _db.Messages
                .Where(m => m.Id == messageId)
                .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsDeletedBySender, _ => true), ct);
        }

        return await _db.Messages
            .Where(m => m.Id == messageId)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsDeletedByReceiver, _ => true), ct);
    }
    public async Task<IReadOnlyList<Message>> GetByConversationAsync(
    Guid conversationId,
    Guid viewerUserId,
    int take,
    DateTime? beforeSentAt,
    CancellationToken ct = default)
    {
        take = take is < 1 ? 50 : take > 200 ? 200 : take;

        var q = _db.Messages
            .Where(m => m.ConversationId == conversationId)
            .Where(m =>
                (m.SenderId == viewerUserId && !m.IsDeletedBySender)
                ||
                (m.SenderId != viewerUserId && !m.IsDeletedByReceiver)
            );

        if (beforeSentAt is not null)
            q = q.Where(m => m.SentAt < beforeSentAt.Value);

        // fetch newest first, take, then reorder ascending for UI
        var page = await q
            .OrderByDescending(m => m.SentAt)
            .Take(take)
            .ToListAsync(ct);

        return page
            .OrderBy(m => m.SentAt)
            .ToList();
    }

}
