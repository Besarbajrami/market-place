using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Common;
using Marketplace.Domain.Entities;
using Marketplace.Application.Common.Errors;

namespace Marketplace.Application.Features.Categories.Commands.CreateCategory;

public sealed class CreateCategoryCommandHandler
    : IRequestHandler<CreateCategoryCommand, Result<Guid>>
{
    private readonly ICategoryRepository _categories;
    private readonly IUnitOfWork _uow;

    public CreateCategoryCommandHandler(
        ICategoryRepository categories,
        IUnitOfWork uow)
    {
        _categories = categories;
        _uow = uow;
    }

    public async Task<Result<Guid>> Handle(CreateCategoryCommand request, CancellationToken ct)
    {
        // Basic validation
        if (string.IsNullOrWhiteSpace(request.Code))
            return Result<Guid>.Failure(new Error("Category.CodeEmpty", "Category code is required."));

        if (string.IsNullOrWhiteSpace(request.Name))
            return Result<Guid>.Failure(new Error("Category.NameEmpty", "Category name is required."));

        if (string.IsNullOrWhiteSpace(request.Slug))
            return Result<Guid>.Failure(new Error("Category.SlugEmpty", "Category slug is required."));

        // Ensure code is unique
        var exists = await _categories.CodeExistsAsync(request.Code, ct);
        if (exists)
            return Result<Guid>.Failure(new Error("Category.CodeExists", "Category code already exists."));

        // Compute sort order for this parent
        var sortOrder = await _categories.GetNextSortOrderAsync(request.ParentId, ct);

        // Create domain entities
        var category = new Category(request.Code, request.ParentId);
        category.SetSortOrder(sortOrder);

        var culture = string.IsNullOrWhiteSpace(request.Culture) ? "mk" : request.Culture;

        var translation = new CategoryTranslation(
            category.Id,
            culture,
            request.Name,
            request.Slug
        );

        await _categories.AddCategoryAsync(category, translation, ct);
        await _uow.SaveChangesAsync(ct);

        return Result<Guid>.Success(category.Id);
    }
}
