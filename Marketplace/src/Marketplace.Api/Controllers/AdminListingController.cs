using Marketplace.Api.Common;
using Marketplace.Application.Features.Admin.Listings.Commands;
using Marketplace.Application.Features.Admin.Listings.Queries;
using Marketplace.Application.Features.Listings.Commands;
using Marketplace.Application.Features.Listings.Commands.SetListingFeatured;
using Marketplace.Application.Features.Listings.Commands.SetListingUrgent;
using Marketplace.Infrastructure.Identity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.Api.Controllers;

[Route("api/admin/listings")]
[Authorize(Roles = AppRoles.Admin)]

public sealed class AdminListingsController : ApiControllerBase
{
    public record RejectListingRequest(string Reason);

    private readonly IMediator _mediator;
    public AdminListingsController(IMediator mediator) => _mediator = mediator;

    public sealed record SetPromotionRequest(DateTime UntilUtc);

    [HttpPost("{id:guid}/featured")]
    public async Task<IActionResult> SetFeatured(Guid id, [FromBody] SetPromotionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new SetListingFeaturedCommand(id, request.UntilUtc), ct);
        return FromResult(result);
    }
    [HttpGet("pending")]
    public async Task<IActionResult> Pending(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    CancellationToken ct = default)
    {
        var result = await _mediator.Send(
            new SearchPendingListingsQuery(page, pageSize),
            ct);

        return FromResult(result);
    }

    [HttpPost("{id:guid}/urgent")]
    public async Task<IActionResult> SetUrgent(Guid id, [FromBody] SetPromotionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new SetListingUrgentCommand(id, request.UntilUtc), ct);
        return FromResult(result);
    }


    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new Application.Features.Admin.Listings.Commands.ApproveListingCommand(id), ct);
        return FromResult(result);
    }


    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(
    Guid id,
    [FromBody] RejectListingRequest request,
    CancellationToken ct)
    {
        var result = await _mediator.Send(
            new RejectListingCommand(id, request.Reason),
            ct);

        return FromResult(result);
    }



    //[HttpPost("{id}/reject")]
    //public async Task<IActionResult> Reject(
    //    Guid id,
    //    [FromBody] RejectListingRequest request,
    //    CancellationToken ct)
    //{
    //    return Ok(await _mediator.Send(
    //        new RejectListingCommand(id, request.Reason), ct));
    //}
}
