using MediatR;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Reports.Commands.ReportListing;

public sealed record ReportListingCommand(
    Guid ListingId,
    Guid ReporterUserId,
    ReportReason Reason,
    string? Details
) : IRequest<Result<ReportListingResponse>>;

public sealed record ReportListingResponse(Guid ListingId);
