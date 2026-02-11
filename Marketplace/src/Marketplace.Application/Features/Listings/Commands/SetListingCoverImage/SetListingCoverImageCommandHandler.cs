using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Listings.Commands.SetListingCoverImage;

public sealed class SetListingCoverImageCommandHandler
    : IRequestHandler<SetListingCoverImageCommand, Result<SetListingCoverImageResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public SetListingCoverImageCommandHandler(IListingRepository listings, IUnitOfWork uow)
    {
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<SetListingCoverImageResponse>> Handle(SetListingCoverImageCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdWithImagesAsync(request.ListingId, ct);
        if (listing is null)
            return Result<SetListingCoverImageResponse>.Failure(ListingErrors.NotFound);

        if (listing.SellerId != request.SellerId)
            return Result<SetListingCoverImageResponse>.Failure(ListingErrors.Forbidden);

        if (listing.Status != ListingStatus.Draft)
            return Result<SetListingCoverImageResponse>.Failure(ListingErrors.NotDraft);

        // Ensure image belongs to listing
        if (!listing.Images.Any(i => i.Id == request.ImageId))
            return Result<SetListingCoverImageResponse>.Failure(new Error("Listing.ImageNotFound", "Image not found for this listing."));

        listing.SetCoverImage(request.ImageId);
        await _uow.SaveChangesAsync(ct);

        return Result<SetListingCoverImageResponse>.Success(new(request.ListingId, request.ImageId));
    }
}
