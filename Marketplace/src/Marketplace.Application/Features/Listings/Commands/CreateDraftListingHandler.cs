using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

public sealed class CreateDraftListingCommandHandler
    : IRequestHandler<CreateDraftListingCommand, Result<CreateDraftListingResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IUnitOfWork _uow;

    public CreateDraftListingCommandHandler(
        IListingRepository listings,
        IUnitOfWork uow)
    {
        _listings = listings;
        _uow = uow;
    }

    public async Task<Result<CreateDraftListingResponse>> Handle(
        CreateDraftListingCommand request,
        CancellationToken ct)
    {
        var listing = Listing.CreateDraft(request.SellerId);
        await _listings.AddAsync(listing, ct);

        await _uow.SaveChangesAsync(ct);

        return Result<CreateDraftListingResponse>.Success(
            new CreateDraftListingResponse(listing.Id));
    }
}
