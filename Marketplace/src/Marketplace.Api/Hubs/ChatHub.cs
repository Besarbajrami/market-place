using Marketplace.Api.Common;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.Conversations.Commands.SendMessage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Marketplace.Api.Hubs;

[Authorize]
public sealed class ChatHub : Hub
{
    private readonly IMediator _mediator;
    private readonly IConversationRepository _conversations;
    private readonly ICurrentUserService _currentUser;
    private readonly PresenceTracker _presence;

    public ChatHub(IMediator mediator, IConversationRepository conversations, ICurrentUserService currentUser, PresenceTracker presence)
    {
        _mediator = mediator;
        _conversations = conversations;
        _currentUser = currentUser;
        _presence = presence;
    }

    private Guid UserId =>
        _currentUser.UserId ?? throw new HubException("Unauthorized");

    // Client calls: joinConversation({conversationId})
    public async Task JoinConversation(Guid conversationId, CancellationToken ct = default)
    {
        var retries = 5;

        for (int i = 0; i < retries; i++)
        {
            var isParticipant = await _conversations.IsParticipantAsync(conversationId, UserId, ct);

            if (isParticipant)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(conversationId), ct);
                return;
            }

            await Task.Delay(100, ct); // wait 100ms and retry
        }

        throw new HubException("Forbidden");
    }


    public Task LeaveConversation(Guid conversationId, CancellationToken ct = default)
        => Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(conversationId), ct);

    // Client calls: sendMessage({conversationId, text})
    public async Task SendMessage(Guid conversationId, string text, CancellationToken ct = default)
    {
        // We send via MediatR so all rules stay in Application layer
        var result = await _mediator.Send(new SendMessageCommand(conversationId, UserId, text), ct);

        if (!result.IsSuccess)
            throw new HubException(result.Error.Code);

        // result.Value should contain message DTO (we will ensure)
        await Clients.Group(GroupName(conversationId))
            .SendAsync("message:new", result.Value, ct);

        // also notify both users to refresh inbox counts
        await Clients.Group(UserGroup(UserId)).SendAsync("conversation:updated", new { conversationId }, ct);
        // We don't know other user id here without extra fetch; we handle it later via separate event in handler
    }

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, UserGroup(UserId));

        var becameOnline = _presence.UserConnected(UserId);
        if (becameOnline)
            await Clients.All.SendAsync("presence:online", new { userId = UserId });

        await base.OnConnectedAsync();
    }
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var becameOffline = _presence.UserDisconnected(UserId);
        if (becameOffline)
            await Clients.All.SendAsync("presence:offline", new { userId = UserId });

        await base.OnDisconnectedAsync(exception);
    }


    private static string GroupName(Guid conversationId) => $"conversation:{conversationId}";
    private static string UserGroup(Guid userId) => $"user:{userId}";
}
