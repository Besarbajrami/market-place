using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Reports.Commands.ReportListing;

public sealed class ReportListingCommandHandler
    : IRequestHandler<ReportListingCommand, Result<ReportListingResponse>>
{
    private const int AutoHideThreshold = 5;

    private readonly IListingRepository _listings;
    private readonly IListingReportRepository _reports;
    private readonly IUnitOfWork _uow;

    public ReportListingCommandHandler(IListingRepository listings, IListingReportRepository reports, IUnitOfWork uow)
    {
        _listings = listings;
        _reports = reports;
        _uow = uow;
    }

    public async Task<Result<ReportListingResponse>> Handle(ReportListingCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdAsync(request.ListingId, ct);
        if (listing is null)
            return Result<ReportListingResponse>.Failure(ListingErrors.NotFound);

        // only published listings can be reported
        if (listing.Status != ListingStatus.Published)
            return Result<ReportListingResponse>.Failure(new Error("Report.ListingNotPublished", "Only published listings can be reported."));

        if (listing.SellerId == request.ReporterUserId)
            return Result<ReportListingResponse>.Failure(new Error("Report.CannotReportOwnListing", "You cannot report your own listing."));

        var already = await _reports.ExistsAsync(request.ListingId, request.ReporterUserId, ct);
        if (already)
            return Result<ReportListingResponse>.Success(new(request.ListingId)); // idempotent

        await _reports.AddAsync(new ListingReport(request.ListingId, request.ReporterUserId, request.Reason, request.Details), ct);

        // Update listing counters/status
        listing.IncrementReportCount();
        listing.SubmitForReview();


        var openCount = await _reports.CountOpenForListingAsync(request.ListingId, ct);
        if (openCount >= AutoHideThreshold)
        {
            listing.Hide("Auto-hidden due to multiple reports.");
        }

        await _uow.SaveChangesAsync(ct);

        return Result<ReportListingResponse>.Success(new(request.ListingId));
    }
}
