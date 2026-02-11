using Marketplace.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly ILocationRepository _locations;

    public LocationsController(ILocationRepository locations)
    {
        _locations = locations;
    }

    [HttpGet("countries")]
    public async Task<IActionResult> GetCountries(CancellationToken ct)
    {
        var items = await _locations.GetCountriesAsync(ct);
        return Ok(items);
    }

    [HttpGet("cities")]
    public async Task<IActionResult> GetCities([FromQuery] string country, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(country))
            return BadRequest("Country is required");

        var items = await _locations.GetCitiesByCountryAsync(country, ct);
        return Ok(items);
    }
}
