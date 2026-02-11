using System.Collections.Concurrent;

namespace Marketplace.Api.Common;

public sealed class PresenceTracker
{
    private readonly ConcurrentDictionary<Guid, int> _connections = new();

    public bool UserConnected(Guid userId)
    {
        _connections.AddOrUpdate(userId, 1, (_, current) => current + 1);
        return _connections[userId] == 1; // first connection => became online
    }

    public bool UserDisconnected(Guid userId)
    {
        if (!_connections.TryGetValue(userId, out var current))
            return false;

        if (current <= 1)
        {
            _connections.TryRemove(userId, out _);
            return true; // became offline
        }

        _connections[userId] = current - 1;
        return false;
    }

    public bool IsOnline(Guid userId) => _connections.ContainsKey(userId);
}
