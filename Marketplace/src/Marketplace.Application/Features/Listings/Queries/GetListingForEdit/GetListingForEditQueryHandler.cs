using MediatR;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Queries.GetListingForEdit;

public sealed class GetListingForEditQueryHandler
    : IRequestHandler<GetListingForEditQuery, Result<GetListingForEditResponse>>
{
    private readonly IListingRepository _repo;

    public GetListingForEditQueryHandler(IListingRepository repo)
    {
        _repo = repo;
    }

    public async Task<Result<GetListingForEditResponse>> Handle(
        GetListingForEditQuery request,
        CancellationToken ct)
    {
        var listing = await _repo.GetByIdWithAttributesAsync(request.ListingId, ct);



        var response = new GetListingForEditResponse(
        listing.Id,
        listing.CategoryId,
        listing.Title!,
        listing.Description!,
        listing.Price ?? 0,
        listing.Currency!,
        listing.LocationCity!,
        listing.LocationRegion!,
        listing.Condition!,
        (int)listing.Status,
        listing.Attributes
            .Select(a => new ListingAttributeValueDto(
                a.CategoryAttributeId,
                a.Value
            ))
            .ToList()
        );

        return Result<GetListingForEditResponse>.Success(response);
    }
}
