using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Listings.Commands.SubmitForReview
{
    public sealed class SubmitListingForReviewCommandHandler
        : IRequestHandler<SubmitListingForReviewCommand, Result>
    {
        private readonly IListingRepository _repo;
        private readonly IUnitOfWork _uow;

        public SubmitListingForReviewCommandHandler(
            IListingRepository repo,
            IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        public async Task<Result> Handle(
            SubmitListingForReviewCommand request,
            CancellationToken ct)
        {
            var listing = await _repo.GetByIdAsync(request.ListingId, ct);

            if (listing is null)
                return Result.Failure(ListingErrors.NotFound);

            if (listing.SellerId != request.SellerId)
                return Result.Failure(ListingErrors.Forbidden);

            if (listing.Status != ListingStatus.Draft)
                return Result.Failure(ListingErrors.NotDraft);

            if (!listing.CanPublish())
                return Result.Failure(
                    ListingErrors.PublishInvalid(listing.GetPublishInvalidReason())
                );

            listing.SubmitForReview();


            await _uow.SaveChangesAsync(ct);

            return Result.Success();
        }
    }

}
