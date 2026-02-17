using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Listings.Commands.SubmitForReview
{
    public sealed record SubmitListingForReviewCommand(
     Guid ListingId,
     Guid SellerId
 ) : IRequest<Result>;

}
