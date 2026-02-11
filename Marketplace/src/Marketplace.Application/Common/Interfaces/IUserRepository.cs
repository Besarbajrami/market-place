using Marketplace.Domain.Entities;

namespace Marketplace.Application.Common.Interfaces;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task AddAsync(UserProfile profile, CancellationToken ct = default);
}
