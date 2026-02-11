using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Api.Common;
using Marketplace.Application.Features.Reports.Commands.ReportListing;
using Marketplace.Domain.Enums;
using Microsoft.AspNetCore.RateLimiting;

namespace Marketplace.Api.Controllers;
[EnableRateLimiting("report-listing")]

[Authorize]
[Route("api/reports")]
public sealed class ReportsController : ApiControllerBase
{
    private readonly IMediator _mediator;
    public ReportsController(IMediator mediator) => _mediator = mediator;

    public sealed record ReportListingRequest(ReportReason Reason, string? Details);

    [HttpPost("listings/{listingId:guid}")]
    public async Task<IActionResult> ReportListing(
        Guid listingId,
        [FromBody] ReportListingRequest request,
        CancellationToken ct)
    {
        var userId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new ReportListingCommand(listingId, userId, request.Reason, request.Details),
            ct);

        return FromResult(result);
    }
}
