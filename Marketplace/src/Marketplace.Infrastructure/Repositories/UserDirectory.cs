using Marketplace.Application.Common.Interfaces;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class UserDirectory : IUserDirectory
{
    private readonly MarketplaceDbContext _db;
    public UserDirectory(MarketplaceDbContext db) => _db = db;

    public async Task<IReadOnlyDictionary<Guid, UserSummary>> GetSummariesAsync(
        IReadOnlyCollection<Guid> userIds,
        CancellationToken ct = default)
    {
        if (userIds.Count == 0)
            return new Dictionary<Guid, UserSummary>();

        var rows = await _db.UserProfiles
            .Where(p => userIds.Contains(p.UserId))
            .Select(p => new UserSummary(p.UserId, p.DisplayName, p.AvatarUrl))
            .ToListAsync(ct);

        return rows.ToDictionary(x => x.UserId, x => x);
    }
}
