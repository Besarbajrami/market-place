using Marketplace.Api.Common;
using Marketplace.Application.Common.Results;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    private IErrorLocalizer? _errorLocalizer;
    private IErrorHttpMapper? _httpMapper;

    protected IErrorLocalizer ErrorLocalizer =>
        _errorLocalizer ??= HttpContext.RequestServices.GetRequiredService<IErrorLocalizer>();

    protected IErrorHttpMapper ErrorHttpMapper =>
        _httpMapper ??= HttpContext.RequestServices.GetRequiredService<IErrorHttpMapper>();

    protected IActionResult FromResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return Ok(result.Value);

        var message = ErrorLocalizer.Localize(result.Error.Code, result.Error.Message);
        var statusCode = ErrorHttpMapper.MapStatusCode(result.Error.Code);

        return StatusCode(statusCode, new
        {
            Code = result.Error.Code,
            Message = message
        });
    }
}
