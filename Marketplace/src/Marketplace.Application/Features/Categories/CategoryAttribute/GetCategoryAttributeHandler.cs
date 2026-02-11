using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using MediatR;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryAttributes;

public sealed class GetCategoryAttributesQueryHandler
    : IRequestHandler<GetCategoryAttributesQuery, Result<IReadOnlyList<CategoryAttributeDto>>>
{
    private readonly ICategoryAttributeRepository _repo;

    public GetCategoryAttributesQueryHandler(ICategoryAttributeRepository repo)
    {
        _repo = repo;
    }

    public async Task<Result<IReadOnlyList<CategoryAttributeDto>>> Handle(
        GetCategoryAttributesQuery request,
        CancellationToken ct)
    {
        var culture = string.IsNullOrWhiteSpace(request.Culture)
            ? "en"
            : request.Culture;

        var attrs = await _repo.GetByCategoryAsync(request.CategoryId, ct);

        var dtos = attrs
            .OrderBy(a => a.SortOrder)
            .Select(a => new CategoryAttributeDto(
                a.Id,
                a.Key,
                a.GetLabel(culture), // ✅ LOCALIZED
                a.Type,
                a.IsRequired,
                a.SortOrder,
                a.Options
                    .OrderBy(o => o.SortOrder)
                    .Select(o => new CategoryAttributeOptionDto(
                        o.Id,
                        o.Value,
                        o.GetLabel(culture), // ✅ LOCALIZED
                        o.SortOrder
                    ))
                    .ToList()
            ))
            .ToList();

        return Result<IReadOnlyList<CategoryAttributeDto>>.Success(dtos);
    }
}
