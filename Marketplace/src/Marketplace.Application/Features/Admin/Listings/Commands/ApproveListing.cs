using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Admin.Listings.Commands
{
    public sealed record ApproveListingCommand(Guid ListingId)
        : IRequest<Result<ApproveListingResponse>>;

    public sealed record ApproveListingResponse(
    Guid ListingId,
    int Status,
    DateTime? PublishedAt
);

}
