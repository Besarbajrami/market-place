using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Listings.Commands.PublishListing;

public sealed class PublishListingCommandHandler
    : IRequestHandler<PublishListingCommand, Result<PublishListingResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;
    private readonly ICategoryRepository _categories;

    public PublishListingCommandHandler(IListingRepository listings, IUnitOfWork uow, ICategoryRepository categories)
    {
        _listings = listings;
        _uow = uow;
        _categories = categories;
    }

    public async Task<Result<PublishListingResponse>> Handle(
        PublishListingCommand request,
        CancellationToken ct)
    {
        var listing = await _listings.GetForPublishAsync(request.ListingId, ct);

        if (listing is null)
            return Result<PublishListingResponse>.Failure(ListingErrors.NotFound);

        if (listing.SellerId != request.SellerId)
            return Result<PublishListingResponse>.Failure(ListingErrors.Forbidden);

        if (listing.Status != ListingStatus.Draft)
            return Result<PublishListingResponse>.Failure(ListingErrors.NotDraft);

        // Domain validation (no try/catch yet)
        if (!listing.CanPublish())
            return Result<PublishListingResponse>.Failure(
                ListingErrors.PublishInvalid(listing.GetPublishInvalidReason())
            );
        //var isLeaf = await _categories.IsLeafAsync(listing.CategoryId, ct);
        //if (!isLeaf)
        //{

        //     return Result<PublishListingResponse>.Failure(ListingErrors.CategoryNotLeaf);
        //}
        listing.Publish();

        await _uow.SaveChangesAsync(ct);

        return Result<PublishListingResponse>.Success(
            new PublishListingResponse(
                listing.Id,
                (int)listing.Status,
                listing.PublishedAt
            )
        );
    }
}
