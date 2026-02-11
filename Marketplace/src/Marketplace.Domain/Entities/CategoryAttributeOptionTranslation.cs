using Marketplace.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Domain.Entities
{
    public class CategoryAttributeOptionTranslation : BaseEntity
    {
        private CategoryAttributeOptionTranslation() { }

        public CategoryAttributeOptionTranslation(
            Guid optionId,
            string culture,
            string label)
        {
            Id = Guid.NewGuid();
            CategoryAttributeOptionId = optionId;
            Culture = culture;
            Label = label;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
        }

        public Guid CategoryAttributeOptionId { get; private set; }
        public string Culture { get; private set; } = default!;
        public string Label { get; private set; } = default!;
    }

}
