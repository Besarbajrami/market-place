using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class UserProfileRepository : IUserProfileRepository
{
    private readonly MarketplaceDbContext _db;
    public UserProfileRepository(MarketplaceDbContext db) => _db = db;

    public Task<UserProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
        => _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public Task AddAsync(UserProfile profile, CancellationToken ct = default)
        => _db.UserProfiles.AddAsync(profile, ct).AsTask();
}
