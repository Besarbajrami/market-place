using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Marketplace.Application.Features.Listings.Queries.GetListingDetails;

public sealed class GetListingDetailsQueryHandler
    : IRequestHandler<GetListingDetailsQuery, Result<GetListingDetailsResponse>>
{
    private readonly IListingRepository _listings;
    private readonly ICategoryRepository _categories;
    private readonly IFavoriteRepository _favorites;

    public GetListingDetailsQueryHandler(IListingRepository listings, ICategoryRepository categories, IFavoriteRepository favorites)
    {
        _listings = listings;
        _categories = categories;
        _favorites = favorites;
    }

    public async Task<Result<GetListingDetailsResponse>> Handle(GetListingDetailsQuery request, CancellationToken ct)
    {
        // Need images for detail page
        var listing = await _listings.GetByIdWithImagesAsync(request.ListingId, ct);
        if (listing is null)
            return Result<GetListingDetailsResponse>.Failure(ListingErrors.NotFound);
        if (listing.ModerationStatus == ModerationStatus.Hidden)
        {
            // allow only seller to view hidden listing
            if (request.ViewerUserId is null || request.ViewerUserId.Value != listing.SellerId)
                return Result<GetListingDetailsResponse>.Failure(ListingErrors.NotFound);
        }

        // Access control
        if (listing.Status != ListingStatus.Published)
        {
            if (request.ViewerUserId is null || request.ViewerUserId.Value != listing.SellerId)
                return Result<GetListingDetailsResponse>.Failure(ListingErrors.NotFound);
        }


        // Category localization
        var label = await _categories.GetLabelAsync(listing.CategoryId, request.Culture, ct);
        var categoryDto = new CategoryDto(listing.CategoryId, label?.Name ?? listing.CategoryId.ToString(), label?.Slug ?? "");

        // Increment view count only for public views (optional)
        // Senior choice: count only when viewer is not seller (prevents self-refresh)
        if (request.ViewerUserId is null || request.ViewerUserId.Value != listing.SellerId)
        {
            await _listings.IncrementViewAsync(listing.Id, ct);
        }

        // Map response
        var images = listing.Images
            .OrderByDescending(i => i.IsCover)
            .ThenBy(i => i.SortOrder)
            .Select(i => new ListingImageDto(i.Id, i.Url, i.IsCover, i.SortOrder))
            .ToList();
        var now = DateTime.UtcNow;
        var isFeatured = listing.FeaturedUntil is not null && listing.FeaturedUntil > now;
        var isUrgent = listing.UrgentUntil is not null && listing.UrgentUntil > now;
        bool isFavorite = false;

        if (request.ViewerUserId is not null)
        {
            isFavorite = await _favorites.ExistsAsync(
                request.ViewerUserId.Value,
                listing.Id,
                ct);
        }

        var response = new GetListingDetailsResponse(
         listing.Id,
         listing.SellerId,
         listing.Title,
         listing.Description,
         listing.Price ?? 0,
         listing.Currency,
         listing.Condition,
         listing.LocationCity,
         listing.LocationRegion,
         (int)listing.Status,
         listing.PublishedAt,
         isFeatured,
         isUrgent,
         listing.FeaturedUntil,
         listing.UrgentUntil,
         listing.ViewCount + ((request.ViewerUserId is null || request.ViewerUserId.Value != listing.SellerId) ? 1 : 0),
         categoryDto,
         images,
         isFavorite
     );


        return Result<GetListingDetailsResponse>.Success(response);
    }
}
