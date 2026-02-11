using System.Security.Claims;

namespace Marketplace.Api.Common;

public static class CurrentUser
{
    public static Guid Id(ClaimsPrincipal user)
    {
        var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(id))
            throw new InvalidOperationException("UserId claim is missing.");
        return Guid.Parse(id);
    }
}
