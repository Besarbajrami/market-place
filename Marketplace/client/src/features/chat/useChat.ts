import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConversationHeader, getInbox, getMessages, sendMessage } from "./chatApi";
import type { MessageDto } from "./chatTypes";
import { http } from "../../api/http";

export function useInbox(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["inbox", page, pageSize],
    queryFn: () => getInbox(page, pageSize),
    staleTime: 10_000
  });
}

export function useMessages(conversationId: string, take: number = 50) {
  return useQuery({
    queryKey: ["conversation-messages", conversationId, take],
    queryFn: () => getMessages(conversationId, take),
    enabled: !!conversationId,
    staleTime: 5_000
  });
}

export function useSendMessage(conversationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId, text),
    onSuccess: (created: MessageDto) => {
      // Optimistically push the new message into cache
      qc.setQueryData(
        ["conversation-messages", conversationId, 50],
        (old: any) => {
          if (!old || !old.items) {
            return { items: [created] };
          }
          return { ...old, items: [...old.items, created] };
        }
      );
      // Also invalidate inbox to refresh last message + unread
      qc.invalidateQueries({ queryKey: ["inbox"] });
    }
  });
}
export function useConversationHeader(conversationId: string) {
    return useQuery({
      queryKey: ["conversation-header", conversationId],
      queryFn: async () => {
        const { data } = await http.get(
          `/api/conversations/${conversationId}/header`
        );
        return data;
      },
      enabled: !!conversationId
    });
  }
  
  