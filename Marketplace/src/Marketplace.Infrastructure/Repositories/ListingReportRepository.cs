using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class ListingReportRepository : IListingReportRepository
{
    private readonly MarketplaceDbContext _db;
    public ListingReportRepository(MarketplaceDbContext db) => _db = db;

    public Task<bool> ExistsAsync(Guid listingId, Guid reporterUserId, CancellationToken ct = default)
        => _db.ListingReports.AnyAsync(r => r.ListingId == listingId && r.ReporterUserId == reporterUserId, ct);

    public Task AddAsync(ListingReport report, CancellationToken ct = default)
        => _db.ListingReports.AddAsync(report, ct).AsTask();

    public Task<int> CountOpenForListingAsync(Guid listingId, CancellationToken ct = default)
        => _db.ListingReports.CountAsync(r => r.ListingId == listingId && r.Status == ReportStatus.Open, ct);
}
