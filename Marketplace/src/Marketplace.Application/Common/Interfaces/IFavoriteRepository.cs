using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface IFavoriteRepository
{
    Task<Favorite?> GetAsync(Guid userId, Guid listingId, CancellationToken ct = default);
    Task AddAsync(Favorite favorite, CancellationToken ct = default);
    void Remove(Favorite favorite);
    Task<bool> ExistsAsync(Guid userId, Guid listingId, CancellationToken ct = default);

    Task<(IReadOnlyList<FavoriteRow> Items, int Total)> GetForUserAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken ct = default);

    // ✅ NEW (bulk read)
    Task<IReadOnlyCollection<Guid>> GetListingIdsForUserAsync(
        Guid userId,
        CancellationToken ct = default);
}

public sealed record FavoriteRow(
    Guid ListingId,
    DateTime CreatedAt
);
