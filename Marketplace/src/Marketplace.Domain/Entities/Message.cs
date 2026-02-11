using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class Message : BaseEntity
{
    private Message() { } // EF

    public Message(Guid conversationId, Guid senderId, string body)
    {
        Id = Guid.NewGuid();
        ConversationId = conversationId;
        SenderId = senderId;
        Body = body;
        SentAt = DateTime.UtcNow;
        CreatedAt = SentAt;
    }

    public Guid ConversationId { get; private set; }
    public Guid SenderId { get; private set; }

    public string Body { get; private set; } = default!;
    public DateTime SentAt { get; private set; }
    public DateTime? ReadAt { get; private set; }

    public bool IsDeletedBySender { get; private set; }
    public bool IsDeletedByReceiver { get; private set; }

    public void MarkRead()
    {
        if (ReadAt is null)
            ReadAt = DateTime.UtcNow;
    }

    public void DeleteForSender() => IsDeletedBySender = true;
    public void DeleteForReceiver() => IsDeletedByReceiver = true;
}
