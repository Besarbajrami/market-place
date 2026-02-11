namespace Marketplace.Application.Common.Interfaces;

public interface ISellerReadService
{
    Task<SellerSummary?> GetSellerSummaryAsync(
        Guid sellerId,
        CancellationToken ct = default);
}

public sealed record SellerSummary(
    Guid Id,
    string DisplayName
);
