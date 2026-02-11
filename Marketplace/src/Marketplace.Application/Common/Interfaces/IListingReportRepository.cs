using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface IListingReportRepository
{
    Task<bool> ExistsAsync(Guid listingId, Guid reporterUserId, CancellationToken ct = default);
    Task AddAsync(ListingReport report, CancellationToken ct = default);
    Task<int> CountOpenForListingAsync(Guid listingId, CancellationToken ct = default);
}
