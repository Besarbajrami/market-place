using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class Conversation : BaseEntity
{
    private readonly List<Message> _messages = new();
    private readonly List<ConversationParticipant> _participants = new();
    public IReadOnlyCollection<ConversationParticipant> Participants => _participants;
    private Conversation() { } // EF

    public Conversation(Guid listingId, Guid sellerId, Guid buyerId)
    {
        Id = Guid.NewGuid();
        ListingId = listingId;
        SellerId = sellerId;
        BuyerId = buyerId;

        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;

        // ✅ THIS IS WHERE THEY GO
        _participants.Add(new ConversationParticipant(Id, sellerId));
        _participants.Add(new ConversationParticipant(Id, buyerId));
    }

    public Guid ListingId { get; private set; }
    public Guid SellerId { get; private set; }
    public Guid BuyerId { get; private set; }

    public bool IsBlocked { get; private set; }
    public DateTime LastMessageAt { get; private set; }

    public IReadOnlyCollection<Message> Messages => _messages;


    public void Block() => IsBlocked = true;
    public void Unblock() => IsBlocked = false;

    public Message AddMessage(Guid senderId, string body)
    {
        if (IsBlocked)
            throw new InvalidOperationException("Conversation is blocked.");

        if (senderId != SellerId && senderId != BuyerId)
            throw new InvalidOperationException("Sender is not a participant.");

        var msg = new Message(Id, senderId, body);
        _messages.Add(msg);

        return msg;
    }

    public void Touch(DateTime nowUtc)
    {
        UpdatedAt = nowUtc;
    }

}
