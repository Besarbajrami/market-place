using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using MediatR;

namespace Marketplace.Application.Features.Categories.Commands.AddCategoryAttributeOption;

public sealed class AddCategoryAttributeOptionCommandHandler
    : IRequestHandler<AddCategoryAttributeOptionCommand, Result<Guid>>
{
    private readonly ICategoryAttributeRepository _repo;
    private readonly IUnitOfWork _uow;

    public AddCategoryAttributeOptionCommandHandler(
        ICategoryAttributeRepository repo,
        IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Result<Guid>> Handle(
        AddCategoryAttributeOptionCommand request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Value))
            return Result<Guid>.Failure(
                new("Option.ValueEmpty", "Option value is required.")
            );

        var attr = await _repo.GetByIdAsync(request.CategoryAttributeId, ct);
        if (attr is null)
            return Result<Guid>.Failure(
                new("CategoryAttribute.NotFound", "Attribute not found.")
            );

        if (attr.Type != CategoryAttributeType.Select)
            return Result<Guid>.Failure(
                new("CategoryAttribute.NotSelect", "Options allowed only for Select attributes.")
            );

        var value = request.Value.Trim();

        var exists = await _repo.OptionExistsAsync(attr.Id, value, ct);
        if (exists)
            return Result<Guid>.Failure(
                new("Option.Exists", "Option already exists.")
            );

        // ✅ CREATE CHILD DIRECTLY (NO AGGREGATE MUTATION)
        var option = new CategoryAttributeOption(
            attr.Id,
            value,
            sortOrder: await _repo.GetNextOptionSortOrder(attr.Id, ct)
        );

        await _repo.AddOptionAsync(option, ct);
        await _uow.SaveChangesAsync(ct);

        return Result<Guid>.Success(option.Id);
    }


}
