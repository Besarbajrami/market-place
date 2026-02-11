using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.GetListingById;

public sealed class GetListingByIdQueryHandler
    : IRequestHandler<GetListingByIdQuery, Result<GetListingByIdResponse>>
{
    private readonly IListingRepository _repo;

    public GetListingByIdQueryHandler(IListingRepository repo)
        => _repo = repo;

    public async Task<Result<GetListingByIdResponse>> Handle(GetListingByIdQuery request, CancellationToken ct)
    {
        var listing = await _repo.GetByIdAsync(request.Id, ct);

        if (listing is null)
            return Result<GetListingByIdResponse>.Failure(ListingErrors.NotFound);

        return Result<GetListingByIdResponse>.Success(
            new GetListingByIdResponse(
                listing.Id,
                listing.SellerId,
                listing.Title,
                listing.Price ?? 0,
                (int)listing.Status
            ));
    }
}
