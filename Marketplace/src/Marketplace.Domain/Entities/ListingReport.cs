using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class ListingReport : BaseEntity
{
    private ListingReport() { }

    public ListingReport(Guid listingId, Guid reporterUserId, ReportReason reason, string? details)
    {
        Id = Guid.NewGuid();
        ListingId = listingId;
        ReporterUserId = reporterUserId;
        Reason = reason;
        Details = details;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
        Status = ReportStatus.Open;
    }

    public Guid ListingId { get; private set; }
    public Guid ReporterUserId { get; private set; }
    public ReportReason Reason { get; private set; }
    public string? Details { get; private set; }

    public ReportStatus Status { get; private set; } // for admin later
}
