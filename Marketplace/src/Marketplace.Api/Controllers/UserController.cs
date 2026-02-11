using MediatR;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Api.Common;
using Marketplace.Application.Features.Users.Queries.GetSellerListings;

namespace Marketplace.Api.Controllers;

[Route("api/users")]
public sealed class UsersController : ApiControllerBase
{
    private readonly IMediator _mediator;
    public UsersController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{sellerId:guid}/listings")]
    public async Task<IActionResult> SellerListings(
        Guid sellerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string sort = "newest",
        CancellationToken ct = default)
    {
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        var result = await _mediator.Send(
            new GetSellerListingsQuery(sellerId, culture, page, pageSize, sort),
            ct);

        return FromResult(result);
    }
}
