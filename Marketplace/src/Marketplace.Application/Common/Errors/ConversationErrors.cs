namespace Marketplace.Application.Common.Errors;

public static class ConversationErrors
{
    public static readonly Error NotFound = new("Conversation.NotFound", "Conversation not found.");
    public static readonly Error Forbidden = new("Conversation.Forbidden", "You are not a participant of this conversation.");
    public static readonly Error CannotMessageSelf =
        new("Conversation.CannotMessageSelf", "You cannot message yourself.");

    public static readonly Error ListingNotAvailable =
        new("Conversation.ListingNotAvailable", "Listing is not available for messaging.");

}
