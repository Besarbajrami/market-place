using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.SetListingFeatured;

public sealed class SetListingFeaturedCommandHandler
    : IRequestHandler<SetListingFeaturedCommand, Result<SetListingFeaturedResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public SetListingFeaturedCommandHandler(IListingRepository listings, IUnitOfWork uow)
    {
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<SetListingFeaturedResponse>> Handle(SetListingFeaturedCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdAsync(request.ListingId, ct);
        if (listing is null)
            return Result<SetListingFeaturedResponse>.Failure(ListingErrors.NotFound);

        try
        {
            listing.SetFeatured(request.UntilUtc);
        }
        catch
        {
            return Result<SetListingFeaturedResponse>.Failure(new Error("Listing.FeatureInvalid", "Featured is invalid."));
        }

        await _uow.SaveChangesAsync(ct);

        return Result<SetListingFeaturedResponse>.Success(new(listing.Id, listing.FeaturedUntil!.Value));
    }
}
