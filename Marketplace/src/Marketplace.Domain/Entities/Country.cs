using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Domain.Entities
{
    public class Country
    {
        public string Code { get; private set; } = default!; // MK, AL, XK
        public string Name { get; private set; } = default!;

        private Country() { } // EF

        public Country(string code, string name)
        {
            Code = code;
            Name = name;
        }
    }

}
