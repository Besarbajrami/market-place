using Marketplace.Application.Common.Results;
using MediatR;

namespace Marketplace.Application.Features.Categories.Commands.AddCategoryAttributeOption;

public sealed record AddCategoryAttributeOptionCommand(
    Guid CategoryAttributeId,
    string Value
) : IRequest<Result<Guid>>;

