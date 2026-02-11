using MediatR;
using Marketplace.Application.Common.Results;

namespace Marketplace.Application.Features.Conversations.Queries.GetConversationHeader;

public sealed record GetConversationHeaderQuery(
    Guid ConversationId,
    Guid UserId
) : IRequest<Result<GetConversationHeaderResponse>>;

public sealed record GetConversationHeaderResponse(
    Guid ConversationId,
    Guid ListingId,
    string ListingTitle,
    decimal Price,
    string Currency
);
