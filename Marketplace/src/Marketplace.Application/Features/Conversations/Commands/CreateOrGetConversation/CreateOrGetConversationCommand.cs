using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Commands.CreateOrGetConversation;

public sealed record CreateOrGetConversationCommand(
    Guid ListingId,
    Guid BuyerId
) : IRequest<Result<CreateOrGetConversationResponse>>;

public sealed record CreateOrGetConversationResponse(
    Guid ConversationId,
    Guid ListingId,
    Guid SellerId,
    Guid BuyerId,
    UserSummaryDto OtherUser
);

public sealed record UserSummaryDto(Guid UserId, string DisplayName, string? AvatarUrl);

