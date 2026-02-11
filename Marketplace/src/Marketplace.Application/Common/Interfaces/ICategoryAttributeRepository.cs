using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface ICategoryAttributeRepository
{
    Task<IReadOnlyList<CategoryAttribute>> GetByCategoryAsync(
        Guid categoryId,
        CancellationToken ct = default);

    /// <summary>
    /// If you later want inheritance from parent categories.
    /// For now you can just call GetByCategoryAsync in implementation.
    /// </summary>
    Task<IReadOnlyList<CategoryAttribute>> GetByCategoryIncludingParentsAsync(
        Guid categoryId,
        CancellationToken ct = default);
    Task<bool> KeyExistsAsync(Guid categoryId, string key, CancellationToken ct = default);
    Task AddAsync(CategoryAttribute attribute, CancellationToken ct = default);
    Task<CategoryAttribute?> GetByIdWithOptionsAsync(Guid attributeId, CancellationToken ct = default);
    Task AddOptionAsync(CategoryAttributeOption option, CancellationToken ct = default);
    void MarkAsUnchanged(CategoryAttribute attribute);
    Task<bool> OptionExistsAsync(Guid attributeId, string value, CancellationToken ct);
    Task<int> GetNextOptionSortOrder(Guid attributeId, CancellationToken ct);

    Task<CategoryAttribute?> GetByIdAsync(Guid id, CancellationToken ct = default);
}
