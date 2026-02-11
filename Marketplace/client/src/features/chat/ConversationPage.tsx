import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useMessages, useSendMessage } from "./useChat";
import { useAuth } from "../../auth/useAuth";
import { useConversationHeader } from "./useChat";
import { useNavigate } from "react-router-dom";

export function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const conversationId = id ?? "";
  const { user } = useAuth();
  const { data, isLoading } = useMessages(conversationId, 50);
  const send = useSendMessage(conversationId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const header = useConversationHeader(conversationId);
  const nav = useNavigate();
  
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.items?.length]);

  if (!conversationId) return <div>Invalid conversation.</div>;
  if (isLoading) return <div style={{ padding: 16 }}>Loading messages...</div>;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await send.mutateAsync(text.trim());
    setText("");
  }

  const myUserId = user?.id; // adjust based on your auth user shape

  return (
    <div style={{}}>
        {header.data && (
  <div
    onClick={() => nav(`/listings/${header.data.listingId}`)}
    style={{
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: 12,
      border: "1px solid #ddd",
      borderRadius: 8,
      marginBottom: 12,
      cursor: "pointer",
      background: "#fafafa"
    }}
  >
    {header.data.coverImageUrl && (
      <img
        src={header.data.coverImageUrl}
        alt={header.data.listingTitle}
        style={{
          width: 80,
          height: 60,
          objectFit: "cover",
          borderRadius: 6
        }}
      />
    )}

    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600 }}>
        {header.data.listingTitle}
      </div>
      <div style={{ fontSize: 14, opacity: 0.8 }}>
        {header.data.price} {header.data.currency}
      </div>
    </div>
  </div>
)}

      <h1>Conversation</h1>

      <div
        style={{
          flex: 1,
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}
      >
        {data?.items.map((m) => {
          const isMine = myUserId && m.senderId === myUserId;
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                maxWidth: "70%",
                padding: "6px 10px",
                borderRadius: 12,
                background: isMine ? "#1976d2" : "#eee",
                color: isMine ? "white" : "black",
                fontSize: 14
              }}
            >
              <div>{m.body}</div>
              <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>
                {new Date(m.sentAt).toLocaleString()}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={send.isPending}>
          Send
        </button>
      </form>
    </div>
  );
}
