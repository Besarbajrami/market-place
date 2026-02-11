using System;
using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Categories.Commands.CreateCategory;

public sealed record CreateCategoryCommand(
    Guid? ParentId,
    string Code,
    string Name,
    string Slug,
    string Culture
) : IRequest<Result<Guid>>;
