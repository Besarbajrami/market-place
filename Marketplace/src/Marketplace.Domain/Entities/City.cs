using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Domain.Entities
{
    public class City
    {
        public Guid Id { get; private set; }
        public string CountryCode { get; private set; } = default!;
        public string Name { get; private set; } = default!;

        private City() { } // EF

        public City(Guid id, string countryCode, string name)
        {
            Id = id;
            CountryCode = countryCode;
            Name = name;
        }
    }

}
