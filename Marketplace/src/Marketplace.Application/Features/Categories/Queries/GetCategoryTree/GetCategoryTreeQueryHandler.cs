using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryTree;

public sealed class GetCategoryTreeQueryHandler
    : IRequestHandler<GetCategoryTreeQuery, Result<IReadOnlyList<CategoryNode>>>
{
    private readonly ICategoryRepository _repo;

    public GetCategoryTreeQueryHandler(ICategoryRepository repo) => _repo = repo;

    public async Task<Result<IReadOnlyList<CategoryNode>>> Handle(GetCategoryTreeQuery request, CancellationToken ct)
    {
        var rows = await _repo.GetAllLocalizedAsync(request.Culture, ct);

        // Build dictionary
        var byId = rows.ToDictionary(
            r => r.Id,
            r => new MutableNode(r.Id, r.Code, r.Name, r.Slug, new List<CategoryNode>(), r.ParentId, r.SortOrder)
        );

        // Build tree
        var roots = new List<MutableNode>();

        foreach (var node in byId.Values)
        {
            if (node.ParentId is null)
            {
                roots.Add(node);
                continue;
            }

            if (byId.TryGetValue(node.ParentId.Value, out var parent))
            {
                parent.Children.Add(node.ToImmutable());
            }
            else
            {
                // orphan -> treat as root
                roots.Add(node);
            }
        }

        // Roots need children in correct order; simplest approach is rebuild using rows order
        // We'll just sort roots by SortOrder
        var result = roots
            .OrderBy(r => r.SortOrder)
            .Select(r => r.ToImmutable())
            .ToList();

        return Result<IReadOnlyList<CategoryNode>>.Success(result);
    }

    private sealed record MutableNode(
        Guid Id,
        string Code,
        string Name,
        string Slug,
        List<CategoryNode> Children,
        Guid? ParentId,
        int SortOrder)
    {
        public CategoryNode ToImmutable()
            => new(Id, Code, Name, Slug, Children);
    }
}
