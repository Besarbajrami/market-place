namespace Marketplace.Application.Common.Interfaces;

public interface IUserDirectory
{
    Task<IReadOnlyDictionary<Guid, UserSummary>> GetSummariesAsync(
        IReadOnlyCollection<Guid> userIds,
        CancellationToken ct = default);
}

public sealed record UserSummary(
    Guid UserId,
    string DisplayName,
    string? AvatarUrl
);
