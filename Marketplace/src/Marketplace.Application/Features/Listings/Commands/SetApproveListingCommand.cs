using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Application.Features.Listings.Commands.BumpListing;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Listings.Commands
{
    public sealed record ApproveListingCommand(Guid ListingId)
      : IRequest<Result>;

    public sealed class ApproveListingCommandHandler
        : IRequestHandler<ApproveListingCommand, Result>
    {
        private readonly IListingRepository _repo;
        private readonly IUnitOfWork _uow;

        public async Task<Result> Handle(
            ApproveListingCommand request,
            CancellationToken ct)
        {
            var listing = await _repo.GetByIdAsync(request.ListingId, ct);
            if (listing is null)
            return Result<BumpListingResponse>.Failure(ListingErrors.Forbidden);
            listing.ApproveAndPublish();
            await _uow.SaveChangesAsync(ct);

            return Result.Success();
        }
    }

}
