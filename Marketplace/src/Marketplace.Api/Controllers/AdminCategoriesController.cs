using Marketplace.Api.Common;
using Marketplace.Application.Features.Categories.Commands.AddCategoryAttributeOption;
using Marketplace.Application.Features.Categories.Commands.CreateCategory;
using Marketplace.Application.Features.Categories.Commands.CreateCategoryAttribute;
using Marketplace.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Marketplace.Api.Controllers;

[Authorize(Policy = "AdminOnly")]
[Route("api/admin/categories")]

public sealed class AdminCategoriesController : ApiControllerBase
{
    private readonly IMediator _mediator;

    public AdminCategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    public sealed record CreateCategoryRequest(
        Guid? ParentId,
        string Code,
        string Name,
        string Slug
    );
    public sealed record CreateCategoryAttributeRequest(
       Guid CategoryId,
       string Key,
       CategoryAttributeType Type,
       bool IsRequired,
       int SortOrder
   );
    public sealed record AddOptionRequest(string Value);

    [HttpPost("attributes/{attributeId:guid}/options")]
    public async Task<IActionResult> AddOption(
        Guid attributeId,
        [FromBody] AddOptionRequest request,
        CancellationToken ct)
    {
        var result = await _mediator.Send(
            new AddCategoryAttributeOptionCommand(attributeId, request.Value),
            ct);

        return FromResult(result);
    }

    [HttpPost("attributes")]
    public async Task<IActionResult> CreateAttribute(
        [FromBody] CreateCategoryAttributeRequest request,
        CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreateCategoryAttributeCommand(
                request.CategoryId,
                request.Key,
                request.Type,
                request.IsRequired,
                request.SortOrder
            ),
            ct);

        return FromResult(result);
    }
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateCategoryRequest request,
        CancellationToken ct)
    {
        // Get culture same as categories query
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        var result = await _mediator.Send(
            new CreateCategoryCommand(
                request.ParentId,
                request.Code,
                request.Name,
                request.Slug,
                culture),
            ct);

        return FromResult(result);
    }
}
