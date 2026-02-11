using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class FavoriteRepository : IFavoriteRepository
{
    private readonly MarketplaceDbContext _db;
    public FavoriteRepository(MarketplaceDbContext db) => _db = db;

    public Task<bool> ExistsAsync(
        Guid userId,
        Guid listingId,
        CancellationToken ct = default)
        => _db.Favorites.AnyAsync(
            x => x.UserId == userId && x.ListingId == listingId,
            ct);

    public Task<Favorite?> GetAsync(
        Guid userId,
        Guid listingId,
        CancellationToken ct = default)
        => _db.Favorites.FirstOrDefaultAsync(
            f => f.UserId == userId && f.ListingId == listingId,
            ct);

    public Task AddAsync(
        Favorite favorite,
        CancellationToken ct = default)
        => _db.Favorites.AddAsync(favorite, ct).AsTask();

    public void Remove(Favorite favorite)
        => _db.Favorites.Remove(favorite);

    public async Task<(IReadOnlyList<FavoriteRow> Items, int Total)>
        GetForUserAsync(
            Guid userId,
            int page,
            int pageSize,
            CancellationToken ct = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 20 : pageSize > 100 ? 100 : pageSize;

        var q = _db.Favorites.Where(f => f.UserId == userId);

        var total = await q.CountAsync(ct);

        var items = await q
            .OrderByDescending(f => f.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new FavoriteRow(
                f.ListingId,
                f.CreatedAt))
            .ToListAsync(ct);

        return (items, total);
    }

    /* ---------------------------------- */
    /* ✅ NEW: bulk favorite IDs           */
    /* ---------------------------------- */
    public async Task<IReadOnlyCollection<Guid>>
        GetListingIdsForUserAsync(
            Guid userId,
            CancellationToken ct = default)
    {
        return await _db.Favorites
            .Where(f => f.UserId == userId)
            .Select(f => f.ListingId)
            .ToListAsync(ct);
    }
}
