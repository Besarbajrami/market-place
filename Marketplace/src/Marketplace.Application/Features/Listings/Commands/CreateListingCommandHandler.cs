using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Features.Listings.Commands.CreateListing;

public sealed class CreateListingCommandHandler
    : IRequestHandler<CreateListingCommand, Result<CreateListingResponse>>
{
    private readonly IListingRepository _repo;
    private readonly IUnitOfWork _uow;
    private readonly IUserProfileRepository _profiles;

    public CreateListingCommandHandler(
        IListingRepository repo,
        IUnitOfWork uow,
        IUserProfileRepository profiles)
    {
        _repo = repo;
        _uow = uow;
        _profiles = profiles;
    }

    public async Task<Result<CreateListingResponse>> Handle(
        CreateListingCommand request,
        CancellationToken ct)
    {
        var profile = await _profiles.GetByUserIdAsync(request.SellerId, ct);
        if (profile is null)
        {
            // For now default display name. Later during auth registration you’ll set real name.
            await _profiles.AddAsync(new UserProfile(request.SellerId, "Seller"), ct);
        }

        var listing = new Listing(
            sellerId: request.SellerId,
            categoryId: request.CategoryId,
            title: request.Title,
            description: request.Description,
            price: request.Price,
            countryCode: request.CountryCode,
            currency: request.Currency,
            city: request.City,
            region: request.Region,
            condition: request.Condition
        );

        await _repo.AddAsync(listing, ct);
        await _uow.SaveChangesAsync(ct);

        return Result<CreateListingResponse>.Success(
            new CreateListingResponse(
                listing.Id,
                (int)listing.Status
            )
        );
    }
}
