using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class CategoryAttributeOption : BaseEntity
{
    private CategoryAttributeOption() { }
    private readonly List<CategoryAttributeTranslation> _translations = new();
    public IReadOnlyCollection<CategoryAttributeTranslation> Translations => _translations;
    public CategoryAttributeOption(Guid categoryAttributeId, string value, int sortOrder)
    {
        Id = Guid.NewGuid();
        CategoryAttributeId = categoryAttributeId;
        Value = value;
        SortOrder = sortOrder;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;

    }
    public string GetLabel(string culture)
    {
        return Translations
            .FirstOrDefault(t => t.Culture == culture)?.Label
            ?? Translations.FirstOrDefault(t => t.Culture == "en")?.Label
            ?? Value;
    }

    public Guid CategoryAttributeId { get; private set; }
    public string Value { get; private set; } = default!;
    public int SortOrder { get; private set; }
}
