using Marketplace.Api.Common;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.Users.Queries.GetMyListings;
using Marketplace.Infrastructure.Identity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.Api.Controllers;

[Authorize(Policy = "UserOnly")]


[Route("api/me")]

public sealed class MeController : ApiControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public MeController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }
    [HttpGet("listings")]
    public async Task<IActionResult> MyListings(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string sort = "newest",
        [FromQuery] int? status = null,
        [FromQuery] bool includeHidden = true,
        CancellationToken ct = default)
    {
        var userId = _currentUser.UserId
          ?? throw new UnauthorizedAccessException("User is not authenticated.");
        if (userId == null)
            return Unauthorized();
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        var result = await _mediator.Send(
            new GetMyListingsQuery(userId, culture, page, pageSize, sort, status, includeHidden),
            ct);

        return FromResult(result);
    }
}
