using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.SetListingUrgent;

public sealed class SetListingUrgentCommandHandler
    : IRequestHandler<SetListingUrgentCommand, Result<SetListingUrgentResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public SetListingUrgentCommandHandler(IListingRepository listings, IUnitOfWork uow)
    {
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<SetListingUrgentResponse>> Handle(SetListingUrgentCommand request, CancellationToken ct)
    {
        var listing = await _listings.GetByIdAsync(request.ListingId, ct);
        if (listing is null)
            return Result<SetListingUrgentResponse>.Failure(ListingErrors.NotFound);

        try
        {
            listing.SetUrgent(request.UntilUtc);
        }
        catch
        {
            return Result<SetListingUrgentResponse>.Failure(new Error("Listing.UrgentInvalid", "Urgent is invalid."));
        }

        await _uow.SaveChangesAsync(ct);

        return Result<SetListingUrgentResponse>.Success(new(listing.Id, listing.UrgentUntil!.Value));
    }
}
