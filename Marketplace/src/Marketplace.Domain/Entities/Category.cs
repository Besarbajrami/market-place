using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class Category : BaseEntity
{
    private readonly List<CategoryTranslation> _translations = new();

    private Category() { }

    public Category(string code, Guid? parentId = null)
    {
        Id = Guid.NewGuid();
        Code = code;
        ParentId = parentId;
        CreatedAt = DateTime.UtcNow;
    }

    public string Code { get; private set; } = default!; // stable key like "vehicles.cars"
    public Guid? ParentId { get; private set; }
    public bool IsActive { get; private set; } = true;
    public int SortOrder { get; private set; }

    public IReadOnlyCollection<CategoryTranslation> Translations => _translations;
    public void SetSortOrder(int sortOrder) => SortOrder = sortOrder;

}
