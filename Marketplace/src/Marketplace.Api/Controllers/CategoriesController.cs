using Marketplace.Api.Common;
using Marketplace.Application.Features.Categories.Queries.GetCategoryAttributes;
using Marketplace.Application.Features.Categories.Queries.GetCategoryTree;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Application.Features.Categories.Queries.GetCategoryAttributes;

namespace Marketplace.Api.Controllers;

[Route("api/categories")]
public sealed class CategoriesController : ApiControllerBase
{
    private readonly IMediator _mediator;
    public CategoriesController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        var result = await _mediator.Send(new GetCategoryTreeQuery(culture), ct);
        return FromResult(result);
    }

    [HttpGet("{categoryId}/attributes")]
    public async Task<IActionResult> GetAttributes(
       Guid categoryId,
       [FromHeader(Name = "Accept-Language")] string culture)
    {
        return FromResult(await _mediator.Send(
            new GetCategoryAttributesQuery(categoryId, culture)
        ));
    }

}
