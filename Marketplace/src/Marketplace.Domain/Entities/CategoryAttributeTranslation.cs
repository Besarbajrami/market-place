using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class CategoryAttributeTranslation : BaseEntity
{
    private CategoryAttributeTranslation() { } // EF Core

    public CategoryAttributeTranslation(
        Guid categoryAttributeId,
        string culture,
        string label)
    {
        Id = Guid.NewGuid();
        CategoryAttributeId = categoryAttributeId;
        Culture = culture;
        Label = label;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid CategoryAttributeId { get; private set; }
    public string Culture { get; private set; } = default!;
    public string Label { get; private set; } = default!;
}
