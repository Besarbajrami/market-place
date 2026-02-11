namespace Marketplace.Api.Common;

public sealed class ErrorHttpMapper : IErrorHttpMapper
{
    public int MapStatusCode(string errorCode)
    {
        // Senior rule-based mapping
        // 1) Most common cases:
        if (errorCode.EndsWith(".NotFound", StringComparison.OrdinalIgnoreCase))
            return StatusCodes.Status404NotFound;

        if (errorCode.EndsWith(".Forbidden", StringComparison.OrdinalIgnoreCase))
            return StatusCodes.Status403Forbidden;

        if (errorCode.EndsWith(".Unauthorized", StringComparison.OrdinalIgnoreCase))
            return StatusCodes.Status401Unauthorized;

        if (errorCode.EndsWith(".Conflict", StringComparison.OrdinalIgnoreCase))
            return StatusCodes.Status409Conflict;

        // 2) Validation always 400
        if (errorCode.StartsWith("Validation.", StringComparison.OrdinalIgnoreCase))
            return StatusCodes.Status400BadRequest;

        // 3) Default
        return StatusCodes.Status400BadRequest;
    }
}
