using Microsoft.Extensions.Localization;

namespace Marketplace.Api.Common;

public sealed class ErrorLocalizer : IErrorLocalizer
{
    private readonly IStringLocalizer<ErrorMessages> _localizer;

    public ErrorLocalizer(IStringLocalizer<ErrorMessages> localizer)
    {
        _localizer = localizer;
    }

    public string Localize(string errorCode, string? fallbackMessage = null)
    {
        // key is errorCode like "Listing.NotFound"
        var value = _localizer[errorCode];

        if (!value.ResourceNotFound && !string.IsNullOrWhiteSpace(value.Value))
            return value.Value;

        return fallbackMessage ?? errorCode;
    }
}

// marker class for resx
public sealed class ErrorMessages { }
