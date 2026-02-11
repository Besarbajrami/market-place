using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly MarketplaceDbContext _db;
    public CategoryRepository(MarketplaceDbContext db) => _db = db;

    public async Task<IReadOnlyList<CategoryFlatRow>> GetAllLocalizedAsync(
        string culture,
        CancellationToken ct = default)
    {
        culture = culture is "mk" or "sq" or "en" ? culture : "mk";

        var query =
            from c in _db.Categories
            join t in _db.CategoryTranslations
                on new { CategoryId = c.Id, Culture = culture }
                equals new { t.CategoryId, t.Culture } into tr
            from t in tr.DefaultIfEmpty()
            join tmk in _db.CategoryTranslations
                on new { CategoryId = c.Id, Culture = "mk" }
                equals new { tmk.CategoryId, tmk.Culture } into trmk
            from tmk in trmk.DefaultIfEmpty()
            where c.IsActive
            orderby c.SortOrder, c.Code
            select new CategoryFlatRow(
                c.Id,
                c.Code,
                c.ParentId,
                t != null ? t.Name : (tmk != null ? tmk.Name : c.Code),
                t != null ? t.Slug : (tmk != null ? tmk.Slug : c.Code),
                c.SortOrder
            );

        return await query.ToListAsync(ct);
    }

    public async Task<CategoryLabel?> GetLabelAsync(Guid categoryId, string culture, CancellationToken ct = default)
    {
        culture = culture is "mk" or "sq" or "en" ? culture : "mk";

        var label = await _db.CategoryTranslations
            .Where(t => t.CategoryId == categoryId && t.Culture == culture)
            .Select(t => new CategoryLabel(t.CategoryId,t.Name, t.Slug))
            .FirstOrDefaultAsync(ct);

        if (label is not null)
            return label;

        // fallback to mk
        return await _db.CategoryTranslations
            .Where(t => t.CategoryId == categoryId && t.Culture == "mk")
            .Select(t => new CategoryLabel(t.CategoryId, t.Name, t.Slug))
            .FirstOrDefaultAsync(ct);
    }

    public async Task<IReadOnlyList<(Guid Id, Guid? ParentId)>> GetAllIdsAsync(CancellationToken ct = default)
    {
        return await _db.Categories
            .Where(c => c.IsActive)
            .Select(c => new ValueTuple<Guid, Guid?>(c.Id, c.ParentId))
            .ToListAsync(ct);
    }

    // ===== New admin/write methods =====

    public async Task<bool> CodeExistsAsync(string code, CancellationToken ct = default)
    {
        return await _db.Categories
            .AnyAsync(c => c.Code == code, ct);
    }

    public async Task<int> GetNextSortOrderAsync(Guid? parentId, CancellationToken ct = default)
    {
        var query = _db.Categories
            .Where(c => c.IsActive && c.ParentId == parentId);

        var max = await query
            .Select(c => (int?)c.SortOrder)
            .MaxAsync(ct);

        return (max ?? 0) + 1;
    }

    public async Task AddCategoryAsync(Category category, CategoryTranslation translation, CancellationToken ct = default)
    {
        await _db.Categories.AddAsync(category, ct);
        await _db.CategoryTranslations.AddAsync(translation, ct);
    }
    public async Task<bool> IsLeafAsync(Guid categoryId, CancellationToken ct = default)
    {
        // A category is a leaf if it has no active children
        var hasChildren = await _db.Categories
            .AnyAsync(c => c.IsActive && c.ParentId == categoryId, ct);

        return !hasChildren;
    }
    public async Task<IReadOnlyDictionary<Guid, CategoryLabel>> GetLabelsAsync(
        IEnumerable<Guid> categoryIds,
        string culture,
        CancellationToken ct = default)
    {
        culture = culture is "mk" or "sq" or "en" ? culture : "mk";

        var labels = await _db.CategoryTranslations
            .Where(t =>
                categoryIds.Contains(t.CategoryId) &&
                t.Culture == culture)
            .Select(t => new CategoryLabel(
                t.CategoryId,
                t.Name,
                t.Slug
            ))
            .ToListAsync(ct);

        return labels.ToDictionary(x => x.CategoryId);
    }


}
