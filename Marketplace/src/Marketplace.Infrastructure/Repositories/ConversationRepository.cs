using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using static Marketplace.Application.Common.Interfaces.IConversationRepository;

namespace Marketplace.Infrastructure.Repositories;

public sealed class ConversationRepository : IConversationRepository
{
    private readonly MarketplaceDbContext _db;
    public ConversationRepository(MarketplaceDbContext db) => _db = db;

    public Task<Conversation?> FindAsync(Guid listingId, Guid sellerId, Guid buyerId, CancellationToken ct = default)
        => _db.Conversations.FirstOrDefaultAsync(
            x => x.ListingId == listingId && x.SellerId == sellerId && x.BuyerId == buyerId, ct);

    public Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => _db.Conversations
    .AsNoTracking()
    .Include(c => c.Messages)
    .FirstOrDefaultAsync(c => c.Id == id, ct);

    public Task AddAsync(Conversation conversation, CancellationToken ct = default)
        => _db.Conversations.AddAsync(conversation, ct).AsTask();
    public async Task<IReadOnlyList<Conversation>> GetForUserAsync(Guid userId, int page, int pageSize, CancellationToken ct = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 20 : pageSize > 100 ? 100 : pageSize;

        return await _db.Conversations
            .Where(c => c.SellerId == userId || c.BuyerId == userId)
            .OrderByDescending(c => c.LastMessageAt)
            .ThenByDescending(c => c.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    public Task<bool> IsParticipantAsync(Guid conversationId, Guid userId, CancellationToken ct = default)
    {
        return _db.ConversationParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId, ct);
    }

    public async Task TouchAsync(Guid conversationId, DateTime now, CancellationToken ct)
    {
        await _db.Conversations
            .Where(c => c.Id == conversationId)
            .ExecuteUpdateAsync(s => s
                .SetProperty(c => c.LastMessageAt, now),
                ct);
    }
    public Task AddMessageAsync(Message message, CancellationToken ct = default)
    {
        return _db.Messages.AddAsync(message, ct).AsTask();
    }

    public async Task SetBlockedAsync(Guid conversationId, bool isBlocked, CancellationToken ct = default)
    {
        await _db.Conversations
            .Where(c => c.Id == conversationId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(c => c.IsBlocked, _ => isBlocked), ct);
    }
    public async Task<(IReadOnlyList<ConversationInboxRow> Items, int Total)> GetInboxAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 20 : pageSize > 100 ? 100 : pageSize;

        var baseQuery =
            from c in _db.Conversations
            join p in _db.ConversationParticipants on c.Id equals p.ConversationId
            join l in _db.Listings on c.ListingId equals l.Id
            where p.UserId == userId
            select new
            {
                Conversation = c,
                Participant = p,
                Listing = l
            };

        var total = await baseQuery.CountAsync(ct);

        var items = await baseQuery
            .OrderByDescending(x => x.Conversation.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new ConversationInboxRow(
                x.Conversation.Id,
                x.Conversation.ListingId,
                x.Listing.Title,
                x.Listing.Price ?? 0,
                x.Listing.Currency,
                x.Conversation.SellerId == userId
                    ? x.Conversation.BuyerId
                    : x.Conversation.SellerId,
                x.Conversation.UpdatedAt,
                _db.Messages
                    .Where(m => m.ConversationId == x.Conversation.Id)
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => m.Body)
                    .FirstOrDefault(),
                _db.Messages
                    .Where(m => m.ConversationId == x.Conversation.Id)
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => (DateTime?)m.SentAt)
                    .FirstOrDefault(),
                _db.Messages.Count(m =>
                    m.ConversationId == x.Conversation.Id &&
                    m.SenderId != userId &&
                    (x.Participant.LastReadAt == null || m.SentAt > x.Participant.LastReadAt))
            ))
            .ToListAsync(ct);

        return (items, total);
    }
    public async Task<ConversationHeaderDto?> GetHeaderAsync(
    Guid conversationId,
    Guid userId,
    CancellationToken ct = default)
    {
        return await (
            from c in _db.Conversations
            join p in _db.ConversationParticipants
                on c.Id equals p.ConversationId
            join l in _db.Listings
                on c.ListingId equals l.Id
            where c.Id == conversationId
               && p.UserId == userId
            select new ConversationHeaderDto(
                c.Id,
                l.Id,
                l.Title,
                l.Price ?? 0,
                l.Currency
            )
        ).FirstOrDefaultAsync(ct);
    }

    public async Task MarkReadAsync(Guid conversationId, Guid userId, DateTime nowUtc, CancellationToken ct = default)
    {
        await _db.ConversationParticipants
            .Where(p => p.ConversationId == conversationId && p.UserId == userId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(p => p.LastReadAt, _ => nowUtc)
                .SetProperty(p => p.UpdatedAt, _ => nowUtc), ct);
    }

}
