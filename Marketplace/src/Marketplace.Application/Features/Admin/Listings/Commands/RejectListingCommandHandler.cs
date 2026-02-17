using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Admin.Listings.Commands
{
    public sealed class RejectListingCommandHandler
        : IRequestHandler<RejectListingCommand, Result<RejectListingResponse>>
    {
        private readonly IListingRepository _repo;
        private readonly IUnitOfWork _uow;

        public RejectListingCommandHandler(
            IListingRepository repo,
            IUnitOfWork uow)
        {
            _repo = repo;
            _uow = uow;
        }

        public async Task<Result<RejectListingResponse>> Handle(
            RejectListingCommand request,
            CancellationToken ct)
        {
            var listing = await _repo.GetByIdAsync(request.ListingId, ct);

            if (listing is null)
                return Result<RejectListingResponse>.Failure(ListingErrors.NotFound);

            listing.Reject(request.Reason);

            await _uow.SaveChangesAsync(ct);

            return Result<RejectListingResponse>.Success(
                new RejectListingResponse(
                    listing.Id,
                    (int)listing.Status,
                    request.Reason
                )
            );
        }
    }

}
