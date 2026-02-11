using FluentValidation;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Reports.Commands.ReportListing;

public sealed class ReportListingCommandValidator : AbstractValidator<ReportListingCommand>
{
    public ReportListingCommandValidator()
    {
        RuleFor(x => x.ListingId).NotEmpty();
        RuleFor(x => x.ReporterUserId).NotEmpty();

        RuleFor(x => x.Reason)
            .IsInEnum()
            .NotEqual(ReportReason.Other) // allow Other, but require details then
            .When(x => string.IsNullOrWhiteSpace(x.Details));

        RuleFor(x => x.Details)
            .MaximumLength(2000);
    }
}
