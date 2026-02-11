using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Listings.Commands.BumpListing;

public sealed class BumpListingCommandHandler
    : IRequestHandler<BumpListingCommand, Result<BumpListingResponse>>
{
    private static readonly TimeSpan Cooldown = TimeSpan.FromHours(24);

    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public BumpListingCommandHandler(IListingRepository listings, IUnitOfWork uow)
    {
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<BumpListingResponse>> Handle(BumpListingCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdAsync(request.ListingId, ct);
        if (listing is null)
            return Result<BumpListingResponse>.Failure(ListingErrors.NotFound);

        if (listing.SellerId != request.SellerId)
            return Result<BumpListingResponse>.Failure(ListingErrors.Forbidden);

        if (listing.Status != ListingStatus.Published)
            return Result<BumpListingResponse>.Failure(ListingErrors.BumpNotAllowed);

        try
        {
            listing.Bump(DateTime.UtcNow, Cooldown);
        }
        catch
        {
            return Result<BumpListingResponse>.Failure(ListingErrors.BumpNotAllowed);
        }

        await _uow.SaveChangesAsync(ct);

        return Result<BumpListingResponse>.Success(new(listing.Id, listing.BumpedAt!.Value));
    }
}
