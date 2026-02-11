using Marketplace.Application.Features.Locations;
using Marketplace.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Infrastructure.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly MarketplaceDbContext _db;

        public LocationRepository(MarketplaceDbContext db)
        {
            _db = db;
        }

        public async Task<IReadOnlyList<CountryDto>> GetCountriesAsync(CancellationToken ct)
        {
            return await _db.Countries
                .OrderBy(c => c.Name)
                .Select(c => new CountryDto(c.Code, c.Name))
                .ToListAsync(ct);
        }

        public async Task<IReadOnlyList<CityDto>> GetCitiesByCountryAsync(string countryCode, CancellationToken ct)
        {
            return await _db.Cities
                .Where(c => c.CountryCode == countryCode)
                .OrderBy(c => c.Name)
                .Select(c => new CityDto(c.Id, c.Name, c.CountryCode))
                .ToListAsync(ct);
        }
    }

}
