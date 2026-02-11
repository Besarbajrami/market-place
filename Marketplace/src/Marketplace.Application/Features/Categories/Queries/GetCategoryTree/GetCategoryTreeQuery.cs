using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Categories.Queries.GetCategoryTree;

public sealed record GetCategoryTreeQuery(string Culture)
    : IRequest<Result<IReadOnlyList<CategoryNode>>>;

public sealed record CategoryNode(
    Guid Id,
    string Code,
    string Name,
    string Slug,
    IReadOnlyList<CategoryNode> Children
);
