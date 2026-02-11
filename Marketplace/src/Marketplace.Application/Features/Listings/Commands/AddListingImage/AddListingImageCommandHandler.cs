using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Listings.Commands.AddListingImage;

public sealed class AddListingImageCommandHandler
    : IRequestHandler<AddListingImageCommand, Result<AddListingImageResponse>>
{
    private const int MaxImagesPerListing = 20;

    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public AddListingImageCommandHandler(IListingRepository listings, IUnitOfWork uow)
    {
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<AddListingImageResponse>> Handle(AddListingImageCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdWithImagesAsync(request.ListingId, ct);
        if (listing is null)
            return Result<AddListingImageResponse>.Failure(ListingErrors.NotFound);

        if (listing.SellerId != request.SellerId)
            return Result<AddListingImageResponse>.Failure(ListingErrors.Forbidden);

        if (listing.Status != ListingStatus.Draft)
            return Result<AddListingImageResponse>.Failure(ListingErrors.NotDraft);

        if (listing.Images.Count >= MaxImagesPerListing)
            return Result<AddListingImageResponse>.Failure(ListingErrors.TooManyImages);

        listing.AddImage(request.Url);

        // Find the last added image id (it was created inside domain)

        await _uow.SaveChangesAsync(ct);
        var addedImage = listing.Images.OrderByDescending(i => i.SortOrder).First();

   

        return Result<AddListingImageResponse>.Success(new(request.ListingId, addedImage.Id, addedImage.IsCover));
    }
}
