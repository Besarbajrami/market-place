using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class CategoryAttributeRepository : ICategoryAttributeRepository
{
    private readonly MarketplaceDbContext _db;

    public CategoryAttributeRepository(MarketplaceDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<CategoryAttribute>> GetByCategoryAsync(
        Guid categoryId,
        CancellationToken ct = default)
    {
        return await _db.CategoryAttributes
            .Include(a => a.Options)
            .Where(a => a.CategoryId == categoryId)
            .OrderBy(a => a.SortOrder)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<CategoryAttribute>> GetByCategoryIncludingParentsAsync(
        Guid categoryId,
        CancellationToken ct = default)
    {
        // v1: just same as GetByCategoryAsync.
        // v2: walk up Category.ParentId chain and merge attributes.
        return await GetByCategoryAsync(categoryId, ct);
    }

    public async Task<CategoryAttribute?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.CategoryAttributes
            .Include(a => a.Options)
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }
    public async Task AddAsync(CategoryAttribute attribute, CancellationToken ct = default)
    {
        await _db.CategoryAttributes.AddAsync(attribute, ct);
    }

    public async Task<bool> KeyExistsAsync(Guid categoryId, string key, CancellationToken ct = default)
    {
        return await _db.CategoryAttributes.AnyAsync(
            a => a.CategoryId == categoryId && a.Key == key,
            ct);
    }

    public Task<CategoryAttribute?> GetByIdWithOptionsAsync(Guid attributeId, CancellationToken ct = default)
    {
        return _db.CategoryAttributes
            .Include(a => a.Options)
            .FirstOrDefaultAsync(a => a.Id == attributeId, ct);
    }

    public Task AddOptionAsync(CategoryAttributeOption option, CancellationToken ct = default)
      => _db.CategoryAttributeOptions.AddAsync(option, ct).AsTask();
    public void MarkAsUnchanged(CategoryAttribute attribute)
    {
        _db.Entry(attribute).State = EntityState.Unchanged;
    }
    public async Task<bool> OptionExistsAsync(
    Guid attributeId,
    string value,
    CancellationToken ct)
    {
        return await _db.CategoryAttributeOptions.AnyAsync(
            o => o.CategoryAttributeId == attributeId &&
                 o.Value.ToLower() == value.ToLower(),
            ct);
    }

    public async Task<int> GetNextOptionSortOrder(
        Guid attributeId,
        CancellationToken ct)
    {
        var max = await _db.CategoryAttributeOptions
            .Where(o => o.CategoryAttributeId == attributeId)
            .MaxAsync(o => (int?)o.SortOrder, ct);

        return (max ?? 0) + 1;
    }

}
