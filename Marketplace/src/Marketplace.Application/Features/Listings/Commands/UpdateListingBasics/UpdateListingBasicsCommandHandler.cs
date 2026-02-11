using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Features.Listings.Commands.UpdateListingBasics;

public sealed class UpdateListingBasicsCommandHandler
    : IRequestHandler<UpdateListingBasicsCommand, Result<Unit>>
{
    private readonly IListingRepository _listings;
    private readonly ICategoryRepository _categories;
    private readonly ICategoryAttributeRepository _categoryAttributes;
    private readonly IUnitOfWork _uow;

    public UpdateListingBasicsCommandHandler(
        IListingRepository listings,
        ICategoryRepository categories,
        ICategoryAttributeRepository categoryAttributes,
        IUnitOfWork uow)
    {
        _listings = listings;
        _categories = categories;
        _categoryAttributes = categoryAttributes;
        _uow = uow;
    }

    public async Task<Result<Unit>> Handle(UpdateListingBasicsCommand request, CancellationToken ct)
    {
        // 1) Load listing with attributes for correct tracking
        var listing = await _listings.GetByIdWithAttributesAsync(request.ListingId, ct);
        if (listing is null)
            return Result<Unit>.Failure(ListingErrors.NotFound);

        // 2) Only Draft is editable (domain also enforces, but we fail gracefully)
        if (listing.Status != ListingStatus.Draft)
            return Result<Unit>.Failure(ListingErrors.NotDraft);

        // 3) Enforce leaf category (you already do this elsewhere; do it here too)
        var isLeaf = await _categories.IsLeafAsync(request.CategoryId, ct);
        if (!isLeaf)
            return Result<Unit>.Failure(ListingErrors.CategoryNotLeaf);

        // 4) Update basics (domain method)
        listing.UpdateBasics(
            request.Title,
            request.Description,
            request.Price,
            request.Currency,
            request.City,
            request.CountryCode,
            request.Region,
            request.Condition,
            request.CategoryId);

        // 5) Validate attributes against category schema
        var schema = await _categoryAttributes.GetByCategoryAsync(request.CategoryId, ct);

        // incoming map
        var incoming = request.Attributes
            .Where(x => x.CategoryAttributeId != Guid.Empty)
            .ToDictionary(x => x.CategoryAttributeId, x => x.Value?.Trim() ?? "");

        // required validation (server truth)
        foreach (var attr in schema.Where(a => a.IsRequired))
        {
            if (!incoming.TryGetValue(attr.Id, out var value) || string.IsNullOrWhiteSpace(value))
            {
                return Result<Unit>.Failure(
                    new Error("Listing.AttributeMissing", $"Required attribute '{attr.Key}' is missing."));
            }
        }

        // optional: reject unknown attribute ids (security hardening)
        var validAttrIds = schema.Select(a => a.Id).ToHashSet();
        if (incoming.Keys.Any(id => !validAttrIds.Contains(id)))
        {
            return Result<Unit>.Failure(
                new Error("Listing.AttributeInvalid", "One or more attributes are invalid for this category."));
        }

        // 6) Persist attribute values on aggregate
        listing.SetAttributes(incoming.Select(kv => (kv.Key, kv.Value)));

        await _uow.SaveChangesAsync(ct);
        return Result<Unit>.Success(Unit.Value);
    }
}
