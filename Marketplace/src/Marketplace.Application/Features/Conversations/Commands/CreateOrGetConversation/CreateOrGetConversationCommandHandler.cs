using MediatR;
using Marketplace.Application.Common.Errors;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Common.Results;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Application.Features.Conversations.Commands.CreateOrGetConversation;

public sealed class CreateOrGetConversationCommandHandler
    : IRequestHandler<CreateOrGetConversationCommand, Result<CreateOrGetConversationResponse>>
{
    private readonly IListingRepository _listings;
    private readonly IConversationRepository _conversations;
    private readonly IUnitOfWork _uow;
    private readonly IUserDirectory _users;

    public CreateOrGetConversationCommandHandler(
        IListingRepository listings,
        IConversationRepository conversations,
        IUnitOfWork uow,
        IUserDirectory users)
    {
        _listings = listings;
        _conversations = conversations;
        _uow = uow;
        _users = users;
    }

    public async Task<Result<CreateOrGetConversationResponse>> Handle(
        CreateOrGetConversationCommand request,
        CancellationToken ct)
    {
        // 1️⃣ Load listing
        var listing = await _listings.GetByIdAsync(request.ListingId, ct);
        if (listing is null)
            return Result<CreateOrGetConversationResponse>.Failure(ListingErrors.NotFound);

        if (listing.Status != ListingStatus.Published ||
            listing.ModerationStatus == ModerationStatus.Hidden)
            return Result<CreateOrGetConversationResponse>.Failure(ConversationErrors.ListingNotAvailable);

        var sellerId = listing.SellerId;
        var buyerId = request.BuyerId;

        if (sellerId == buyerId)
            return Result<CreateOrGetConversationResponse>.Failure(ConversationErrors.CannotMessageSelf);

        // 2️⃣ Resolve seller summary (for UI)
        var summaries = await _users.GetSummariesAsync(new[] { sellerId }, ct);
        summaries.TryGetValue(sellerId, out var sellerSummary);

        var otherUser = sellerSummary is null
            ? new UserSummaryDto(sellerId, "Seller", null)
            : new UserSummaryDto(sellerSummary.UserId, sellerSummary.DisplayName, sellerSummary.AvatarUrl);

        // 3️⃣ Check existing conversation
        var existing = await _conversations.FindAsync(request.ListingId, sellerId, buyerId, ct);
        if (existing is not null)
        {
            return Result<CreateOrGetConversationResponse>.Success(
                new CreateOrGetConversationResponse(
                    existing.Id,
                    existing.ListingId,
                    existing.SellerId,
                    existing.BuyerId,
                    otherUser
                ));
        }

        // 4️⃣ Create new conversation (participants added in constructor)
        var convo = new Conversation(request.ListingId, sellerId, buyerId);

        try
        {
            await _conversations.AddAsync(convo, ct);
            await _uow.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            // 5️⃣ Handle race condition
            var again = await _conversations.FindAsync(request.ListingId, sellerId, buyerId, ct);
            if (again is not null)
            {
                return Result<CreateOrGetConversationResponse>.Success(
                    new CreateOrGetConversationResponse(
                        again.Id,
                        again.ListingId,
                        again.SellerId,
                        again.BuyerId,
                        otherUser
                    ));
            }

            throw;
        }

        // 6️⃣ Return newly created conversation
        return Result<CreateOrGetConversationResponse>.Success(
            new CreateOrGetConversationResponse(
                convo.Id,
                convo.ListingId,
                convo.SellerId,
                convo.BuyerId,
                otherUser
            ));
    }
}
