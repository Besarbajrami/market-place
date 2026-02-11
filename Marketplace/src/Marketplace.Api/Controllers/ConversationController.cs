using MediatR;
using Microsoft.AspNetCore.Mvc;
using Marketplace.Application.Features.Conversations.Commands.CreateOrGetConversation;
using Marketplace.Application.Features.Conversations.Commands.SendMessage;
using Marketplace.Application.Features.Conversations.Queries.GetMyConversations;
using Marketplace.Application.Features.Conversations.Queries.GetConversationMessages;
using Marketplace.Application.Features.Conversations.Commands.MarkConversationRead;
using Marketplace.Application.Features.Conversations.Commands.SetConversationBlocked;
using Marketplace.Application.Features.Conversations.Commands.DeleteMessageForMe;
using Microsoft.AspNetCore.Authorization;
using Marketplace.Api.Common;
using Microsoft.AspNetCore.RateLimiting;
using Marketplace.Application.Features.Conversations.Queries.GetInbox;
using Marketplace.Application.Features.Conversations.Queries.GetConversationHeader;

namespace Marketplace.Api.Controllers;

[Authorize]
[Route("api/conversations")]
public sealed class ConversationsController : ApiControllerBase
{
    private readonly IMediator _mediator;
    public ConversationsController(IMediator mediator) => _mediator = mediator;

    public sealed record CreateConversationRequest(Guid ListingId);

    [HttpPost("start")]
    public async Task<IActionResult> Start(
        [FromBody] StartConversationRequest request,
        CancellationToken ct)
    {
        var buyerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new CreateOrGetConversationCommand(request.ListingId, buyerId),
            ct);

        return FromResult(result);
    }
    public sealed record StartConversationRequest(Guid ListingId);

    [HttpGet("")]
    public async Task<IActionResult> Inbox(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var userId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new GetInboxQuery(userId, page, pageSize),
            ct);

        return FromResult(result);
    }




    [HttpPost("{conversationId:guid}/read")]
    public async Task<IActionResult> MarkRead(Guid conversationId, CancellationToken ct)
    {
        var userId = CurrentUser.Id(User);

        var result = await _mediator.Send(new MarkConversationReadCommand(conversationId, userId), ct);
        return FromResult(result);
    }

 


    public sealed record SetBlockedRequest(Guid UserId, bool IsBlocked);

    [HttpPost("{conversationId:guid}/block")]
    public async Task<IActionResult> SetBlocked(
        Guid conversationId,
        [FromBody] SetBlockedRequest request,
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(new SetConversationBlockedCommand(conversationId, request.UserId, request.IsBlocked), ct);
        return FromResult(result);
    }
    [HttpDelete("{conversationId:guid}/messages/{messageId:guid}")]
    public async Task<IActionResult> DeleteMessageForMe(
        Guid conversationId,
        Guid messageId,
        CancellationToken ct = default)
    {
        var userId = CurrentUser.Id(User);
        var result = await _mediator.Send(new DeleteMessageForMeCommand(conversationId, messageId, userId), ct);
        return FromResult(result);
    }


    // --------------------
    // INBOX (my conversations)
    // --------------------
    [HttpGet("legacy")]
    public async Task<IActionResult> GetMyConversations(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var userId = CurrentUser.Id(User);
        var result = await _mediator.Send(new GetMyConversationsQuery(userId, page, pageSize), ct);
        return FromResult(result);
    }



    // --------------------
    // MESSAGES (for a conversation)
    // --------------------
[HttpGet("{conversationId:guid}/messages")]
public async Task<IActionResult> GetMessages(
    Guid conversationId,
    [FromQuery] int take = 50,
    [FromQuery] DateTime? before = null,
    CancellationToken ct = default)
{
    var userId = CurrentUser.Id(User);

    var result = await _mediator.Send(
        new GetConversationMessagesQuery(conversationId, userId, take, before),
        ct);

    return FromResult(result);
}


    [HttpGet("{conversationId:guid}/header")]
    public async Task<IActionResult> Header(Guid conversationId, CancellationToken ct)
    {
        var userId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new GetConversationHeaderQuery(conversationId, userId),
            ct);

        return FromResult(result);
    }



    public sealed record SendMessageRequest(string Body);
    [EnableRateLimiting("send-message")]
    [HttpPost("{conversationId:guid}/messages")]
    public async Task<IActionResult> SendMessage(
    Guid conversationId,
    [FromBody] SendMessageRequest request,
    CancellationToken ct = default)
    {
        var userId = CurrentUser.Id(User);
        var result = await _mediator.Send(new SendMessageCommand(conversationId, userId, request.Body), ct);
        return FromResult(result);
    }

}
