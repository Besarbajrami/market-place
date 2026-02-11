export type ConversationInboxRow = {
    conversationId: string;
    listingId: string;
  
    // listing info
    title: string;
    coverImageUrl?: string | null;
    price: number;
    currency: string;
  
    // conversation info
    otherUserId: string;
    updatedAt: string;
    lastMessageText?: string | null;
    lastMessageAt?: string | null;
    unreadCount: number;
  };
  
  export type InboxResponse = {
    items: ConversationInboxRow[];
    total: number;
    page: number;
    pageSize: number;
  };
  
  export type MessageDto = {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
    sentAt: string;
    readAt?: string | null;
  };
  
  export type MessagesResponse = {
    items: MessageDto[];
  };
  