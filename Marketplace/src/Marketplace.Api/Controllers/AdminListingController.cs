using MediatR;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Api.Common;
using Marketplace.Application.Features.Listings.Commands.SetListingFeatured;
using Marketplace.Application.Features.Listings.Commands.SetListingUrgent;
using Marketplace.Application.Features.Listings.Commands;

namespace Marketplace.Api.Controllers;

[Route("api/admin/listings")]
[AdminKeyAuthorize]
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

    [HttpPost("{id:guid}/urgent")]
    public async Task<IActionResult> SetUrgent(Guid id, [FromBody] SetPromotionRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new SetListingUrgentCommand(id, request.UntilUtc), ct);
        return FromResult(result);
    }
 

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id, CancellationToken ct)
    {
        return Ok(await _mediator.Send(new ApproveListingCommand(id), ct));
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
