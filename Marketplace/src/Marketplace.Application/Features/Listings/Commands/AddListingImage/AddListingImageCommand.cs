using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Listings.Commands.AddListingImage;

public sealed record AddListingImageCommand(
    Guid ListingId,
    Guid SellerId,
    string Url
) : IRequest<Result<AddListingImageResponse>>;

public sealed record AddListingImageResponse(
    Guid ListingId,
    Guid ImageId,
    bool IsCover
);
