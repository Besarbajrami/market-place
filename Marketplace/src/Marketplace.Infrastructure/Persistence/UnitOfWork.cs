using Marketplace.Application.Common.Interfaces;

namespace Marketplace.Infrastructure.Persistence;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly MarketplaceDbContext _db;
    public UnitOfWork(MarketplaceDbContext db) => _db = db;

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);
}
