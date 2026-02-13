using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using MediatR;
using static Marketplace.Application.Common.Interfaces.IListingRepository;

namespace Marketplace.Application.Features.Listings.Queries.SearchListingsV2;

public sealed class SearchListingsV2QueryHandler
    : IRequestHandler<SearchListingsV2Query, Result<SearchListingsV2Response>>
{
    private readonly IListingRepository _listings;
    private readonly ICategoryRepository _categories;
    private readonly IFavoriteRepository _favorites; // ✅ NEW

    public SearchListingsV2QueryHandler(
        IListingRepository listings,
        ICategoryRepository categories,
        IFavoriteRepository favorites) // ✅ NEW
    {
        _listings = listings;
        _categories = categories;
        _favorites = favorites;
    }

    public async Task<Result<SearchListingsV2Response>> Handle(
        SearchListingsV2Query request,
        CancellationToken ct)
    {
        var page = request.Page < 1 ? 1 : request.Page;
        var pageSize = request.PageSize < 1 ? 20 : request.PageSize > 100 ? 100 : request.PageSize;

        IReadOnlyCollection<Guid>? categoryIds = null;

        if (request.CategoryId is not null)
        {
            if (request.IncludeChildCategories)
            {
                var all = await _categories.GetAllIdsAsync(ct);
                categoryIds = GetDescendants(all, request.CategoryId.Value);
            }
            else
            {
                categoryIds = new[] { request.CategoryId.Value };
            }
        }

        var spec = new ListingSearchSpec(
            request.Query,
            categoryIds,
            request.City,
            request.Region,
            request.MinPrice,
            request.MaxPrice,
            request.Condition,
            request.Sort,
            page,
            pageSize,
            request.CountryCode
        );

        var (rows, total) = await _listings.SearchPublishedAsync(spec, ct);

        HashSet<Guid> favoriteIds = new();
        if (request.ViewerId.HasValue)
        {
            favoriteIds = (await _favorites.GetListingIdsForUserAsync(
                request.ViewerId.Value,
                ct)).ToHashSet();
        }

        var categoryIdsDistinct = rows
            .Select(r => r.CategoryId)
            .Distinct()
            .ToList();

        var labels = await _categories.GetLabelsAsync(
            categoryIdsDistinct,
            request.Culture,
            ct);

        var items = new List<ListingSearchItem>(rows.Count);
        var now = DateTime.UtcNow;

        foreach (var r in rows)
        {
            var category = labels.TryGetValue(r.CategoryId, out var lbl)
                ? new CategoryLabelDto(r.CategoryId, lbl.Name, lbl.Slug)
                : new CategoryLabelDto(r.CategoryId, r.CategoryId.ToString(), "");

            items.Add(new ListingSearchItem(
          r.Id,
          r.Title,
          r.Price,
          r.Currency,
          r.City,
          r.Region,
          r.PublishedAt,
          r.CoverImageUrl,
          r.Images
              .Select(i => new ListingImagePreviewDto(i.Id, i.Url))
              .ToList(),
          r.FeaturedUntil is not null && r.FeaturedUntil > now,
          r.UrgentUntil is not null && r.UrgentUntil > now,
          category,
          request.ViewerId.HasValue && favoriteIds.Contains(r.Id),
          r.CountryCode
      ));
        }

        return Result<SearchListingsV2Response>.Success(
            new(page, pageSize, total, items));
    }

    private static IReadOnlyCollection<Guid> GetDescendants(
        IReadOnlyList<(Guid Id, Guid? ParentId)> all,
        Guid rootId)
    {
        var childrenByParent = all
            .Where(x => x.ParentId.HasValue)
            .GroupBy(x => x.ParentId!.Value)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.Id).ToList()
            );

        var result = new HashSet<Guid> { rootId };
        var stack = new Stack<Guid>();
        stack.Push(rootId);

        while (stack.Count > 0)
        {
            var current = stack.Pop();

            if (!childrenByParent.TryGetValue(current, out var children))
                continue;

            foreach (var child in children)
            {
                if (result.Add(child))
                    stack.Push(child);
            }
        }

        return result.ToList();
    }

}
