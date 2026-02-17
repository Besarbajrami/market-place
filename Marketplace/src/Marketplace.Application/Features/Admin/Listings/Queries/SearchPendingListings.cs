using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Admin.Listings.Queries
{
    public sealed record SearchPendingListingsQuery(
     int Page = 1,
     int PageSize = 20
 ) : IRequest<Result<SearchPendingListingsResponse>>;
    public sealed record AdminPendingListingItem(
    Guid Id,
    string Title,
    string SellerId,
    DateTime CreatedAt,
    int ImageCount
);

    public sealed record SearchPendingListingsResponse(
        int Page,
        int PageSize,
        int Total,
        IReadOnlyList<AdminPendingListingItem> Items
    );

}
