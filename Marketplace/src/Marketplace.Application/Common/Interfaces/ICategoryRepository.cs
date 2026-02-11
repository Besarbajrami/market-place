using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface ICategoryRepository
{
    // ===== Existing query methods =====
    Task<IReadOnlyList<CategoryFlatRow>> GetAllLocalizedAsync(string culture, CancellationToken ct = default);
    Task<CategoryLabel?> GetLabelAsync(Guid categoryId, string culture, CancellationToken ct = default);
    Task<IReadOnlyList<(Guid Id, Guid? ParentId)>> GetAllIdsAsync(CancellationToken ct = default);

    // ===== New admin/write methods =====

    /// <summary>
    /// Checks if a category with the given code already exists.
    /// </summary>
    Task<bool> CodeExistsAsync(string code, CancellationToken ct = default);

    /// <summary>
    /// Returns the next SortOrder value for a given parent (max + 1).
    /// </summary>
    Task<int> GetNextSortOrderAsync(Guid? parentId, CancellationToken ct = default);

    /// <summary>
    /// Adds a new category and its translation.
    /// </summary>
    Task AddCategoryAsync(Category category, CategoryTranslation translation, CancellationToken ct = default);
    Task<bool> IsLeafAsync(Guid categoryId, CancellationToken ct = default);
    Task<IReadOnlyDictionary<Guid, CategoryLabel>> GetLabelsAsync(
    IEnumerable<Guid> categoryIds,
    string culture,
    CancellationToken ct = default);

}

// Flat row to build tree in Application
public sealed record CategoryFlatRow(
    Guid Id,
    string Code,
    Guid? ParentId,
    string Name,
    string Slug,
    int SortOrder
);

public sealed record CategoryLabel(
    Guid CategoryId,
    string Name,
    string Slug
);

