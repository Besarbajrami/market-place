using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public enum CategoryAttributeType
{
    Text = 1,
    Number = 2,
    Select = 3,
    Boolean = 4
    // Later: Range, MultiSelect, etc.
}

public class CategoryAttribute : BaseEntity
{
    private readonly List<CategoryAttributeOption> _options = new();
    private readonly List<CategoryAttributeTranslation> _translations = new();
    public IReadOnlyCollection<CategoryAttributeTranslation> Translations => _translations;
    private CategoryAttribute() { } // EF

    public CategoryAttribute(
        Guid categoryId,
        string key,
        CategoryAttributeType type,
        bool isRequired,
        int sortOrder)
    {
        Id = Guid.NewGuid();
        CategoryId = categoryId;
        Key = key;
        Type = type;
        IsRequired = isRequired;
        SortOrder = sortOrder;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt; 
    }

    public Guid CategoryId { get; private set; }

    /// <summary>
    /// Stable technical key, e.g. "brand", "model", "year", "rooms"
    /// </summary>
    public string Key { get; private set; } = default!;

    public CategoryAttributeType Type { get; private set; }
    public bool IsRequired { get; private set; }
    public int SortOrder { get; private set; }

    public IReadOnlyCollection<CategoryAttributeOption> Options => _options;

    public void Update(
        string key,
        CategoryAttributeType type,
        bool isRequired,
        int sortOrder)
    {
        Key = key;
        Type = type;
        IsRequired = isRequired;
        SortOrder = sortOrder;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt; // ✅ correct
    }
    public string GetLabel(string culture)
    {
        return _translations
            .FirstOrDefault(t => t.Culture == culture)?.Label
            ?? _translations.FirstOrDefault(t => t.Culture == "en")?.Label
            ?? Key;
    }
    public void AddOption(string value)
    {
        var nextOrder = _options.Count == 0 ? 1 : _options.Max(o => o.SortOrder) + 1;
        _options.Add(new CategoryAttributeOption(Id, value, nextOrder));
    }
}
