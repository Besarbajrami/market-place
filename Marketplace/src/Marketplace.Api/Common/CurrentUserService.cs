using Marketplace.Application.Common.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Marketplace.Api.Common;

public sealed class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _http;

    public CurrentUserService(IHttpContextAccessor http) => _http = http;

    public bool IsAuthenticated =>
        _http.HttpContext?.User?.Identity?.IsAuthenticated == true;

    public Guid? UserId
    {
        get
        {
            var user = _http.HttpContext?.User;
            if (user?.Identity?.IsAuthenticated != true)
                return null;

            // 1️⃣ Try ASP.NET Identity standard
            var id =
                user.FindFirstValue(ClaimTypes.NameIdentifier)
                // 2️⃣ Fallback to JWT standard
                ?? user.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return Guid.TryParse(id, out var guid) ? guid : null;
        }
    }
}
