using Marketplace.Application.Common.Interfaces;
using Marketplace.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace Marketplace.Infrastructure.Services;

public sealed class SellerReadService : ISellerReadService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public SellerReadService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<SellerSummary?> GetSellerSummaryAsync(
        Guid sellerId,
        CancellationToken ct = default)
    {
        var user = await _userManager.FindByIdAsync(sellerId.ToString());

        if (user is null)
            return null;

        // You can improve display name later (username, profile name, etc.)
        return new SellerSummary(
            sellerId,
            user.Email ?? "Seller"
        );
    }
}
