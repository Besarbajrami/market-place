using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using MediatR;

namespace Marketplace.Application.Features.Categories.Commands.CreateCategoryAttribute;

public sealed record CreateCategoryAttributeCommand(
    Guid CategoryId,
    string Key,
    CategoryAttributeType Type,
    bool IsRequired,
    int SortOrder
) : IRequest<Result<Guid>>;
