using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Domain.Common
{

    public abstract class BaseEntity
    {
        public Guid Id { get; protected set; }
        public DateTime CreatedAt { get; protected set; }
        public DateTime UpdatedAt { get; protected set; }
        public DateTime? DeletedAt { get; protected set; }
        public bool IsDeleted => DeletedAt.HasValue;

        public void SoftDelete()
        {
            if (DeletedAt is not null) return;
            DeletedAt = DateTime.UtcNow;
        }
    }

}
