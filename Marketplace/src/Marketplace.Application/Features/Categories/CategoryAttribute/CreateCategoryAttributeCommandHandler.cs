using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Application.Features.Categories.Commands.CreateCategoryAttribute;
using Marketplace.Domain.Entities;
using MediatR;

namespace Marketplace.Application.Features.Categories.Commands.CreateCategoryAttribute;

public sealed class CreateCategoryAttributeCommandHandler
    : IRequestHandler<CreateCategoryAttributeCommand, Result<Guid>>
{
    private readonly ICategoryRepository _categories;
    private readonly ICategoryAttributeRepository _attributes;
    private readonly IUnitOfWork _uow;

    public CreateCategoryAttributeCommandHandler(
        ICategoryRepository categories,
        ICategoryAttributeRepository attributes,
        IUnitOfWork uow)
    {
        _categories = categories;
        _attributes = attributes;
        _uow = uow;
    }

    public async Task<Result<Guid>> Handle(
        CreateCategoryAttributeCommand request,
        CancellationToken ct)
    {
        // 1. Category must exist and be leaf
        var isLeaf = await _categories.IsLeafAsync(request.CategoryId, ct);
        if (!isLeaf)
            return Result<Guid>.Failure(
                new("Category.NotLeaf", "Attributes can be added only to leaf categories.")
            );

        // 2. Key must be unique per category
        var exists = await _attributes.KeyExistsAsync(
            request.CategoryId,
            request.Key,
            ct);

        if (exists)
            return Result<Guid>.Failure(
                new("CategoryAttribute.KeyExists", "Attribute key already exists for this category.")
            );

        var attr = new CategoryAttribute(
            request.CategoryId,
            request.Key.Trim(),
            request.Type,
            request.IsRequired,
            request.SortOrder
        );

        await _attributes.AddAsync(attr, ct);
        await _uow.SaveChangesAsync(ct);

        return Result<Guid>.Success(attr.Id);
    }
}
