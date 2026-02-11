import { http } from "../../api/http";
import type {
  InboxResponse,
  MessagesResponse,
  MessageDto
} from "./chatTypes";

export async function getInbox(page: number, pageSize: number) {
    const { data } = await http.get<InboxResponse>("/api/conversations", {
      params: { page, pageSize }
    });
    return data;
  }
  
export async function getMessages(
  conversationId: string,
  take: number = 50
) {
  const { data } = await http.get<MessagesResponse>(
    `/api/conversations/${conversationId}/messages`,
    {
      params: { take }
    }
  );
  return data;
}

export async function sendMessage(
  conversationId: string,
  text: string
): Promise<MessageDto> {
  const { data } = await http.post<MessageDto>(
    `/api/conversations/${conversationId}/messages`,
    { body: text }
  );
  return data;
}
export type ConversationHeaderDto = {
    conversationId: string;
    listingId: string;
    listingTitle: string;
    coverImageUrl?: string | null;
    price: number;
    currency: string;
  };
  
  export async function getConversationHeader(conversationId: string) {
    const { data } = await http.get<ConversationHeaderDto>(
      `/api/conversations/${conversationId}`
    );
    return data;
  }
  