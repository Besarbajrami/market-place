import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInbox } from "./useChat";

export function InboxPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, isError } = useInbox(page, pageSize);
  const nav = useNavigate();

  if (isLoading) return <div style={{ padding: 16 }}>Loading inbox...</div>;
  if (isError) return <div style={{ padding: 16 }}>Failed to load inbox.</div>;

  const totalPages = data
    ? Math.max(1, Math.ceil(data.total / data.pageSize))
    : 1;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Inbox</h1>

      {data?.items.length === 0 && <div>No conversations yet.</div>}

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {data?.items.map((c) => (
 <div
 key={c.conversationId}
 onClick={() => nav(`/inbox/${c.conversationId}`)}
 style={{
   border: "1px solid var(--border)",
   borderRadius: 10,
   padding: 12,
   cursor: "pointer",
   background:
     c.unreadCount > 0
       ? "var(--surface-highlight)"
       : "var(--surface)",
   color: "var(--text)",
   display: "flex",
   gap: 12,
   alignItems: "center"
 }}
>
            {/* LISTING IMAGE */}
            {c.coverImageUrl ? (
              <img
                src={c.coverImageUrl}
                alt={c.title}
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "cover",
                  borderRadius: 8,
                  flexShrink: 0
                }}
              />
            ) : (
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 8,
                  background: "var(--surface-2)",
                  flexShrink: 0
                }}
              />
            )}

            {/* MAIN INFO */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {c.title}
              </div>

              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {c.price} {c.currency}
              </div>

              <div
                style={{
                  fontSize: 13,
                 color: "var(--text-muted)",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {c.lastMessageText ?? "(no messages yet)"}
              </div>
            </div>

            {/* META */}
            <div
              style={{
                textAlign: "right",
                fontSize: 12,
              color: "var(--text-muted)",
                minWidth: 90
              }}
            >
              {c.lastMessageAt &&
                new Date(c.lastMessageAt).toLocaleString()}

              {c.unreadCount > 0 && (
                <div
                  style={{
                    marginTop: 6,
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "#1976d2",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  {c.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data && data.total > data.pageSize && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 8,
            alignItems: "center"
          }}
        >
      <button
  onClick={() => setPage((p) => Math.max(1, p - 1))}
  disabled={page <= 1}
  style={{
    padding: "6px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    cursor: "pointer",
    opacity: page <= 1 ? 0.5 : 1
  }}
>
  Prev
</button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
