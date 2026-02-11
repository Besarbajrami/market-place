using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Listings.Commands.UpdateDraftListing;

public sealed class UpdateDraftListingCommandHandler
    : IRequestHandler<UpdateDraftListingCommand, Result<UpdateDraftListingResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;
    private readonly ICategoryRepository _categories;

    public UpdateDraftListingCommandHandler(IListingRepository listings, IUnitOfWork uow, ICategoryRepository categories)
    {
        _listings = listings;
        _uow = uow;
        _categories = categories;
    }

    public async Task<Result<UpdateDraftListingResponse>> Handle(UpdateDraftListingCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdAsync(request.ListingId, ct);
        if (listing is null)
            return Result<UpdateDraftListingResponse>.Failure(ListingErrors.NotFound);

        if (listing.SellerId != request.SellerId)
            return Result<UpdateDraftListingResponse>.Failure(ListingErrors.Forbidden);

        if (listing.Status != ListingStatus.Draft)
            return Result<UpdateDraftListingResponse>.Failure(ListingErrors.NotDraft);
        var isLeaf = await _categories.IsLeafAsync(request.CategoryId, ct);
        if (!isLeaf)
        {
            if (listing.Status != ListingStatus.Draft)
                return Result<UpdateDraftListingResponse>.Failure(ListingErrors.CategoryNotLeaf);

        }
        listing.UpdateBasics(
            request.Title,
            request.Description,
            request.Price,
            request.CountryCode,
            request.Currency,
            request.City,
            request.Region,
            request.Condition,
            request.CategoryId
        );

        await _uow.SaveChangesAsync(ct);

        return Result<UpdateDraftListingResponse>.Success(
        new UpdateDraftListingResponse(listing.Id, listing.UpdatedAt)
    );

    }
}
