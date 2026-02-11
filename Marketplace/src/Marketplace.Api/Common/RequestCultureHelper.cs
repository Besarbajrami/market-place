using Microsoft.AspNetCore.Localization;

namespace Marketplace.Api.Common;

public static class RequestCultureHelper
{
    public static string GetCulture(HttpContext httpContext)
    {
        // This is set by app.UseRequestLocalization(...)
        var feature = httpContext.Features.Get<IRequestCultureFeature>();
        var culture = feature?.RequestCulture.UICulture?.TwoLetterISOLanguageName;

        return culture is "mk" or "sq" or "en" ? culture : "mk";
    }
}
