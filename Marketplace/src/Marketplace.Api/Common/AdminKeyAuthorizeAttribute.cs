using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Marketplace.Api.Common;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class AdminKeyAuthorizeAttribute : Attribute, IAsyncActionFilter
{
    private const string HeaderName = "X-Admin-Key";

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        var expected = config["Admin:Key"];

        if (string.IsNullOrWhiteSpace(expected))
        {
            context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
            return;
        }

        if (!context.HttpContext.Request.Headers.TryGetValue(HeaderName, out var provided) ||
            string.IsNullOrWhiteSpace(provided) ||
            !string.Equals(provided.ToString(), expected, StringComparison.Ordinal))
        {
            context.Result = new UnauthorizedObjectResult(new { Code = "Admin.Unauthorized", Message = "Admin key required." });
            return;
        }

        await next();
    }
}
