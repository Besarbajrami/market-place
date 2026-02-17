using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Admin.Listings.Commands
{
    public sealed class ApproveListingCommandHandler
        : IRequestHandler<ApproveListingCommand, Result<ApproveListingResponse>>
    {
        private readonly IListingRepository _repo;
        private readonly IUnitOfWork _uow;

        public ApproveListingCommandHandler(
            IListingRepository repo,
            IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        public async Task<Result<ApproveListingResponse>> Handle(
            ApproveListingCommand request,
            CancellationToken ct)
        {
            var listing = await _repo.GetByIdAsync(request.ListingId, ct);

            if (listing is null)
                return Result<ApproveListingResponse>.Failure(ListingErrors.NotFound);

            listing.ApproveAndPublish();

            await _uow.SaveChangesAsync(ct);

            return Result<ApproveListingResponse>.Success(
                new ApproveListingResponse(
                    listing.Id,
                    (int)listing.Status,
                    listing.PublishedAt
                )
            );
        }
    }

}
