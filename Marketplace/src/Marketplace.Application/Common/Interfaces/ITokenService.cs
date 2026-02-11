using Marketplace.Application.Common.Auth;

namespace Marketplace.Application.Common.Interfaces;

public interface ITokenService
{
    Task<TokenPair> CreateTokenPairAsync(Guid userId, string email, CancellationToken ct = default);
}
