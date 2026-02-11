using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class ConversationParticipant : BaseEntity
{
    private ConversationParticipant() { }

    public ConversationParticipant(Guid conversationId, Guid userId)
    {
        Id = Guid.NewGuid();
        ConversationId = conversationId;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid ConversationId { get; private set; }
    public Guid UserId { get; private set; }

    // track last message read time (or last message id later)
    public DateTime? LastReadAt { get; private set; }

    public void MarkRead(DateTime nowUtc)
    {
        LastReadAt = nowUtc;
        UpdatedAt = nowUtc;
    }
}
