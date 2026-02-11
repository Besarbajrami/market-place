using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Api.Common;
using Marketplace.Application.Features.Favorites.Commands.AddFavorite;
using Marketplace.Application.Features.Favorites.Commands.RemoveFavorite;
using Marketplace.Application.Features.Favorites.Queries.GetMyFavorites;

namespace Marketplace.Api.Controllers;

[Authorize]
[Route("api/favorites")]
public sealed class FavoritesController : ApiControllerBase
{
    private readonly IMediator _mediator;
    public FavoritesController(IMediator mediator) => _mediator = mediator;

    [HttpPost("{listingId:guid}")]
    public async Task<IActionResult> Add(Guid listingId, CancellationToken ct)
    {
        var userId = CurrentUser.Id(User);
        var result = await _mediator.Send(new AddFavoriteCommand(listingId, userId), ct);
        return FromResult(result);
    }

    [HttpDelete("{listingId:guid}")]
    public async Task<IActionResult> Remove(Guid listingId, CancellationToken ct)
    {
        var userId = CurrentUser.Id(User);
        var result = await _mediator.Send(new RemoveFavoriteCommand(listingId, userId), ct);
        return FromResult(result);
    }

    [HttpGet]
    public async Task<IActionResult> MyFavorites(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var userId = CurrentUser.Id(User);
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        var result = await _mediator.Send(new GetMyFavoritesQuery(userId, culture, page, pageSize), ct);
        return FromResult(result);
    }
}
