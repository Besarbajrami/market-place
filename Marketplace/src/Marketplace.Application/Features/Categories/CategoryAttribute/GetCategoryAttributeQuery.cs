using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using MediatR;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryAttributes;

public sealed record GetCategoryAttributesQuery(
    Guid CategoryId,
    string? Culture
) : IRequest<Result<IReadOnlyList<CategoryAttributeDto>>>;

public sealed record CategoryAttributeDto(
    Guid Id,
    string Key,
    string Label,
    CategoryAttributeType Type,
    bool IsRequired,
    int SortOrder,
    IReadOnlyList<CategoryAttributeOptionDto> Options
);

public sealed record CategoryAttributeOptionDto(
    Guid Id,
    string Value,
    string Label,
    int SortOrder
);

