using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Admin.Listings.Commands
{
    public sealed record RejectListingCommand(
        Guid ListingId,
        string Reason
    ) : IRequest<Result<RejectListingResponse>>;

    public sealed record RejectListingResponse(
    Guid ListingId,
    int Status,
    string Reason
);

}
