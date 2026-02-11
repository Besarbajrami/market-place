using Marketplace.Application.Common.Interfaces;
using Marketplace.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Claims;
using System.Text;

namespace Marketplace.Api.Controllers;
[AllowAnonymous]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _config;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config, ITokenService tokenService)
    {
        _userManager = userManager;
        _config = config;
        _tokenService = tokenService;
    }

    public sealed record RegisterRequest(string Email, string Password);
    public sealed record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)

    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // assign default role
        await _userManager.AddToRoleAsync(user, AppRoles.User);

        return Ok();

    }
    [Authorize]
    [HttpPost("language")]
    public async Task<IActionResult> SetLanguage([FromBody] SetLanguageRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return Unauthorized();

        var culture = request.Culture?.Trim().ToLowerInvariant();
        if (culture is not ("mk" or "sq" or "en"))
            return BadRequest(new { Code = "Language.Invalid", Message = "Unsupported language." });

        user.PreferredCulture = culture;
        await _userManager.UpdateAsync(user);

        return Ok(new { culture });
    }

    public sealed record SetLanguageRequest(string Culture);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized();

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!)
        };

        var tokenPair = await _tokenService.CreateTokenPairAsync(user.Id, user.Email!, HttpContext.RequestAborted);

        return Ok(new
        {
            accessToken = tokenPair.AccessToken,
            accessTokenExpiresAtUtc = tokenPair.AccessTokenExpiresAtUtc,
            refreshToken = tokenPair.RefreshToken,
            refreshTokenExpiresAtUtc = tokenPair.RefreshTokenExpiresAtUtc
        });

    }
}
