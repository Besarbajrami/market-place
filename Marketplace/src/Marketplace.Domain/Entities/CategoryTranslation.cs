using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class CategoryTranslation : BaseEntity
{
    private CategoryTranslation() { }

    public CategoryTranslation(Guid categoryId, string culture, string name, string slug)
    {
        Id = Guid.NewGuid();
        CategoryId = categoryId;
        Culture = culture; // "mk" / "sq" / "en"
        Name = name;
        Slug = slug;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid CategoryId { get; private set; }
    public string Culture { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
}
