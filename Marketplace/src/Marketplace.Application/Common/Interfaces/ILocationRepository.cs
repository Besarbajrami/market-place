using Marketplace.Application.Features.Locations;

public interface ILocationRepository
{
    Task<IReadOnlyList<CountryDto>> GetCountriesAsync(CancellationToken ct);
    Task<IReadOnlyList<CityDto>> GetCitiesByCountryAsync(string countryCode, CancellationToken ct);
}
