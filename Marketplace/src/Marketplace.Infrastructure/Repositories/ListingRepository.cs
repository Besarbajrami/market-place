using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using static Marketplace.Application.Common.Interfaces.IListingRepository;

namespace Marketplace.Infrastructure.Repositories;

public sealed class ListingRepository : IListingRepository
{
    private readonly MarketplaceDbContext _db;
    public ListingRepository(MarketplaceDbContext db) => _db = db;

    public Task AddAsync(Listing listing, CancellationToken ct = default)
        => _db.Listings.AddAsync(listing, ct).AsTask();

    public Task<Listing?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => _db.Listings.FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<(IReadOnlyList<Listing> Items, int TotalCount)> SearchAsync(
    string? query, decimal? minPrice, decimal? maxPrice, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _db.Listings.AsQueryable();


        if (!string.IsNullOrWhiteSpace(query))
        {
            var term = $"%{query.Trim()}%";
            q = q.Where(l => EF.Functions.ILike(l.Title!, term));
        }

        if (minPrice is not null)
            q = q.Where(x => x.Price >= minPrice.Value);

        if (maxPrice is not null)
            q = q.Where(x => x.Price <= maxPrice.Value);

        // Stable order for paging (senior MUST)
        q = q.OrderByDescending(x => x.CreatedAt).ThenByDescending(x => x.Id);

        var total = await q.CountAsync(ct);
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);

        return (items, total);
    }
    public async Task<Guid?> GetSellerIdAsync(Guid listingId, CancellationToken ct = default)
    {
        return await _db.Listings
            .Where(l => l.Id == listingId)
            .Select(l => (Guid?)l.SellerId)
            .FirstOrDefaultAsync(ct);
    }
    public Task<Listing?> GetByIdWithImagesAsync(Guid id, CancellationToken ct = default)
    {
        return _db.Listings
            .Include(l => l.Images)
            .FirstOrDefaultAsync(l => l.Id == id, ct);
    }
    public async Task IncrementViewAsync(Guid listingId, CancellationToken ct = default)
    {
        await _db.Listings
            .Where(l => l.Id == listingId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(l => l.ViewCount, l => l.ViewCount + 1), ct);
    }
    public async Task<(IReadOnlyList<ListingSearchRow> Items, int TotalCount)> SearchPublishedAsync(
    ListingSearchSpec spec,
    CancellationToken ct = default)
    {
        var page = spec.Page < 1 ? 1 : spec.Page;
        var pageSize = spec.PageSize < 1 ? 20 : spec.PageSize > 100 ? 100 : spec.PageSize;

        var q = _db.Listings.AsQueryable();

        // Only published
        q = q.Where(l => l.Status == ListingStatus.Published);
        q = q.Where(l => l.ModerationStatus == ModerationStatus.Approved);

        if (!string.IsNullOrWhiteSpace(spec.Query))
        {
            var term = spec.Query.Trim().ToLower();
            q = q.Where(l => l.Title.ToLower().Contains(term));
        }

        if (spec.CategoryIds is { Count: > 0 })
            q = q.Where(l => spec.CategoryIds.Contains(l.CategoryId));

        if (!string.IsNullOrWhiteSpace(spec.City))
            q = q.Where(l => l.LocationCity == spec.City);

        if (!string.IsNullOrWhiteSpace(spec.Region))
            q = q.Where(l => l.LocationRegion == spec.Region);
        if (!string.IsNullOrWhiteSpace(spec.CountryCode))
            q = q.Where(l => l.LocationCountryCode == spec.CountryCode);
        if (spec.MinPrice is not null)
            q = q.Where(l => l.Price >= spec.MinPrice.Value);

        if (spec.MaxPrice is not null)
            q = q.Where(l => l.Price <= spec.MaxPrice.Value);

        if (!string.IsNullOrWhiteSpace(spec.Condition))
            q = q.Where(l => l.Condition == spec.Condition);

        // Sorting
        var now = DateTime.UtcNow;

        // Base query already filtered to Published and not Hidden (keep that)
        q = spec.Sort switch
        {
            "price_asc" => q
                .OrderByDescending(l => l.FeaturedUntil != null && l.FeaturedUntil > now)
                .ThenByDescending(l => l.UrgentUntil != null && l.UrgentUntil > now)
                .ThenByDescending(l => l.BumpedAt)
                .ThenBy(l => l.Price)
                .ThenByDescending(l => l.PublishedAt)
                .ThenByDescending(l => l.Id),

            "price_desc" => q
                .OrderByDescending(l => l.FeaturedUntil != null && l.FeaturedUntil > now)
                .ThenByDescending(l => l.UrgentUntil != null && l.UrgentUntil > now)
                .ThenByDescending(l => l.BumpedAt)
                .ThenByDescending(l => l.Price)
                .ThenByDescending(l => l.PublishedAt)
                .ThenByDescending(l => l.Id),

            _ => q
                .OrderByDescending(l => l.FeaturedUntil != null && l.FeaturedUntil > now)
                .ThenByDescending(l => l.UrgentUntil != null && l.UrgentUntil > now)
                .ThenByDescending(l => l.BumpedAt)
                .ThenByDescending(l => l.PublishedAt)
                .ThenByDescending(l => l.Id)
                .ThenByDescending(l => l.Id)
        };


        var total = await q.CountAsync(ct);

        // Project with cover image
        // cover = first where IsCover or lowest SortOrder
        var items = await q
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(l => new ListingSearchRow(
            l.Id,
            l.Title,
            l.Price ?? 0,
            l.Currency,
            l.LocationCity,
            l.LocationRegion,
            l.PublishedAt ?? DateTime.UtcNow,
            l.CategoryId,
            _db.ListingImages
                .Where(i => i.ListingId == l.Id)
                .OrderByDescending(i => i.IsCover)
                .ThenBy(i => i.SortOrder)
                .Select(i => i.Url)
                .FirstOrDefault(),

            // ✅ LOAD TOP 3 IMAGES
            _db.ListingImages
                .Where(i => i.ListingId == l.Id)
                .OrderByDescending(i => i.IsCover)
                .ThenBy(i => i.SortOrder)
                .Take(3)
                .Select(i => new ListingImageRow(
                    i.Id,
                    i.Url
                ))
                .ToList(),

            l.FeaturedUntil,
            l.UrgentUntil,
            l.LocationCountryCode
        ))
        .ToListAsync(ct);

        return (items, total);
    }
    public Task<bool> IsPublishedAsync(Guid listingId, CancellationToken ct = default)
    {
        return _db.Listings.AnyAsync(l =>
            l.Id == listingId &&
            l.Status == ListingStatus.Published &&
            l.ModerationStatus == ModerationStatus.Approved,
            ct);
    }
    public async Task<(IReadOnlyList<Listing> Items, int TotalCount)>
    SearchPendingAsync(int page, int pageSize, CancellationToken ct = default)
    {
        var q = _db.Listings
            .Where(l => l.Status == ListingStatus.PendingReview && l.ModerationStatus == ModerationStatus.Pending)
            .OrderByDescending(l => l.CreatedAt);

        var total = await q.CountAsync(ct);

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(l => l.Images)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<ListingSearchRow?> GetSearchRowAsync(Guid listingId, CancellationToken ct = default)
    {
        return await _db.Listings
.Where(l =>
    l.Id == listingId &&
    l.Status == ListingStatus.Published &&
    l.ModerationStatus == ModerationStatus.Approved)
            .Select(l => new ListingSearchRow(
                l.Id,
                l.Title,
                l.Price ?? 0,
                l.Currency,
                l.LocationCity,
                l.LocationRegion,
                l.PublishedAt ?? DateTime.UtcNow,
                l.CategoryId,
           _db.ListingImages
            .Where(i => i.ListingId == l.Id)
            .OrderByDescending(i => i.IsCover)
            .ThenBy(i => i.SortOrder)
            .Select(i => i.Url)
            .FirstOrDefault(),

        _db.ListingImages
            .Where(i => i.ListingId == l.Id)
            .OrderByDescending(i => i.IsCover)
            .ThenBy(i => i.SortOrder)
            .Take(3)
            .Select(i => new ListingImageRow(
                i.Id,
                i.Url
            ))
            .ToList(),
                l.FeaturedUntil,
l.UrgentUntil,
l.LocationCountryCode
            ))
            .FirstOrDefaultAsync(ct);
    }
    public async Task<(IReadOnlyList<ListingSearchRow> Items, int TotalCount)> SearchBySellerAsync(
    Guid sellerId,
    bool onlyPublic,
    ListingSellerSearchSpec spec,
    CancellationToken ct = default)
    {
        var page = spec.Page < 1 ? 1 : spec.Page;
        var pageSize = spec.PageSize < 1 ? 20 : spec.PageSize > 100 ? 100 : spec.PageSize;

        var q = _db.Listings.Where(l => l.SellerId == sellerId);

        if (onlyPublic)
        {
            // Public profile: only published and not hidden
            q = q.Where(l => l.Status == ListingStatus.Published)
                 .Where(l => l.ModerationStatus != ModerationStatus.Hidden);
        }
        else
        {
            // /me: allow all statuses, but optionally hide hidden ones
            if (!spec.IncludeHidden)
                q = q.Where(l => l.ModerationStatus != ModerationStatus.Hidden);

            if (spec.Status is not null)
            {
                var status = (ListingStatus)spec.Status.Value;
                q = q.Where(l => l.Status == status);
            }
        }

        // sorting
        q = spec.Sort switch
        {
            "price_asc" => q.OrderBy(l => l.Price).ThenByDescending(l => l.PublishedAt),
            "price_desc" => q.OrderByDescending(l => l.Price).ThenByDescending(l => l.PublishedAt),
            _ => q.OrderByDescending(l => l.PublishedAt ?? l.CreatedAt).ThenByDescending(l => l.Id)
        };

        var total = await q.CountAsync(ct);

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new ListingSearchRow(
                l.Id,
                l.Title,
                l.Price ?? 0,
                l.Currency,
                l.LocationCity,
                l.LocationRegion,
                l.PublishedAt ?? l.CreatedAt,
                l.CategoryId,
         _db.ListingImages
            .Where(i => i.ListingId == l.Id)
            .OrderByDescending(i => i.IsCover)
            .ThenBy(i => i.SortOrder)
            .Select(i => i.Url)
            .FirstOrDefault(),

        _db.ListingImages
            .Where(i => i.ListingId == l.Id)
            .OrderByDescending(i => i.IsCover)
            .ThenBy(i => i.SortOrder)
            .Take(3)
            .Select(i => new ListingImageRow(
                i.Id,
                i.Url
            ))
            .ToList(),
                l.FeaturedUntil,
l.UrgentUntil,
l.LocationCountryCode
            ))
            .ToListAsync(ct);

        return (items, total);
    }
    public async Task<(IReadOnlyList<MyListingRow> Items, int TotalCount)> SearchMyListingsAsync(
    Guid sellerId,
    MyListingsSpec spec,
    CancellationToken ct = default)
    {
        var page = spec.Page < 1 ? 1 : spec.Page;
        var pageSize = spec.PageSize < 1 ? 20 : spec.PageSize > 100 ? 100 : spec.PageSize;

        var q = _db.Listings.Where(l => l.SellerId == sellerId);

        if (!spec.IncludeHidden)
            q = q.Where(l => l.ModerationStatus != ModerationStatus.Hidden);

        if (spec.Status is not null)
        {
            var status = (ListingStatus)spec.Status.Value;
            q = q.Where(l => l.Status == status);
        }

        q = spec.Sort switch
        {
            "price_asc" => q.OrderBy(l => l.Price).ThenByDescending(l => l.PublishedAt),
            "price_desc" => q.OrderByDescending(l => l.Price).ThenByDescending(l => l.PublishedAt),
            _ => q.OrderByDescending(l => l.CreatedAt).ThenByDescending(l => l.Id)
        };

        var total = await q.CountAsync(ct);

        var items = await q
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new MyListingRow(
                l.Id,
                l.Title,
                l.Price ?? 0,
                l.Currency,
                l.LocationCity,
                l.LocationRegion,
                l.CreatedAt,
                l.PublishedAt,
                (int)l.Status,
                (int)l.ModerationStatus,
                l.ReportCount ?? 0,
                l.CategoryId,
                _db.ListingImages
                    .Where(i => i.ListingId == l.Id)
                    .OrderByDescending(i => i.IsCover)
                    .ThenBy(i => i.SortOrder)
                    .Select(i => i.Url)
                    .FirstOrDefault(),
                l.LocationCountryCode
            ))
            .ToListAsync(ct);

        return (items, total);
    }
    //public async Task<Listing?> GetForPublishAsync(Guid listingId, CancellationToken ct = default)
    //{
    //    return await _db.Listings
    //        .Include(l => l.Images)
    //        .FirstOrDefaultAsync(l => l.Id == listingId, ct);
    //}
    public Task<Listing?> GetByIdWithAttributesAsync(
    Guid listingId,
    CancellationToken ct = default)
    {
        return _db.Listings
            .Include(l => l.Images)          // keep images if needed
            .Include(l => l.Attributes)      // 🔴 THIS IS THE IMPORTANT PART
            .FirstOrDefaultAsync(l => l.Id == listingId, ct);
    }

}
