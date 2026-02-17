import { useMemo, useState } from "react";
import {
  useAdminPendingListings,
  useApproveListing,
  useRejectListing
} from "../../../api/admin/listings/useAdminPendingListings";
import { AdminPendingCard } from "../components/AdminPendingCard";

export function AdminPendingListingsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useAdminPendingListings(page, pageSize);
  const approve = useApproveListing();
  const reject = useRejectListing();

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    listingId?: string;
    title?: string;
  }>({ open: false });

  const [rejectReason, setRejectReason] = useState("");

  if (isLoading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (error) return <div style={{ padding: 16 }}>Error loading pending listings.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Pending listings</h1>

      <div style={{ marginBottom: 12, color: "#555" }}>
        Total: {data?.total ?? 0}
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 12,
          boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
   <div style={{ display: "grid", gap: 16 }}>
  {(data?.items ?? []).map(item => (
    <AdminPendingCard key={item.id} listing={item} />
  ))}

  {data?.items?.length === 0 && (
    <div>No pending listings 🎉</div>
  )}
</div>

      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        <button
          style={btn}
          disabled={page <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <div style={{ alignSelf: "center", color: "#555" }}>
          Page {page} / {totalPages}
        </div>

        <button
          style={btn}
          disabled={page >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>

      {/* Reject modal */}
      {rejectModal.open && (
        <div style={overlay}>
          <div style={modal}>
            <h3 style={{ marginTop: 0 }}>Reject listing</h3>
            <div style={{ color: "#666", marginBottom: 8 }}>
              {rejectModal.title}
            </div>

            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              style={{
                width: "100%",
                minHeight: 90,
                padding: 10,
                borderRadius: 10,
                border: "1px solid #ddd"
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button
                style={btn}
                onClick={() => setRejectModal({ open: false })}
                disabled={reject.isPending}
              >
                Cancel
              </button>

              <button
                style={btnDanger}
                disabled={!rejectReason.trim() || reject.isPending}
                onClick={() => {
                  reject.mutate({
                    id: rejectModal.listingId!,
                    reason: rejectReason.trim()
                  });
                  setRejectModal({ open: false });
                }}
              >
                {reject.isPending ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: 12,
  fontSize: 13,
  color: "#444"
};

const td: React.CSSProperties = {
  padding: 12,
  verticalAlign: "top"
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer"
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: "#1976d2",
  color: "white",
  border: "1px solid #1976d2",
  fontWeight: 700
};

const btnDanger: React.CSSProperties = {
  ...btn,
  background: "#d32f2f",
  color: "white",
  border: "1px solid #d32f2f",
  fontWeight: 700
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "grid",
  placeItems: "center",
  padding: 16
};

const modal: React.CSSProperties = {
  background: "white",
  borderRadius: 16,
  padding: 16,
  width: "min(520px, 100%)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.2)"
};
