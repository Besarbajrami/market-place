import { useNavigate } from "react-router-dom";
import {
  useMyListings,
  useDeleteListing,
  usePublishListing,
  useCreateDraftListing
} from "./useMyListings";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { useTranslation } from "react-i18next";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://localhost:7012";

export function MyListingsPage() {
  const nav = useNavigate();
  const { data, isLoading } = useMyListings();
  const del = useDeleteListing();
  const publish = usePublishListing();
  const createDraft = useCreateDraftListing();
  const { t } = useTranslation();

  if (isLoading) return <div>Loading...</div>;

  /* ---------------------------------- */
  /* ✅ NEW: hide empty drafts           */
  /* ---------------------------------- */
  const visibleItems =
    data?.items.filter(x => {
      // keep non-drafts
      if (x.status !== 0) return true;

      // draft visibility rules
      const hasTitle = x.title?.trim().length > 0;
      const hasPrice = x.price > 0;
      const hasImage = !!x.coverImageUrl;

      return hasTitle || hasPrice || hasImage;
    }) ?? [];

  return (
    <Container>
      <div style={{ display: "grid", gap: 16 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h1 style={{ margin: 0 }}>
            {t("common.MyListings")}
          </h1>

          <button
            onClick={async () => {
              const result = await createDraft.mutateAsync();
              nav(`/me/listings/${result.id}/edit`);
            }}
            style={{
              background: "var(--primary)",
              color: "white",
              border: 0,
              padding: "10px 14px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            + {t("common.NewListings")}
          </button>
        </div>

        {/* EMPTY STATE */}
        {visibleItems.length === 0 && (
          <Card>{t("common.NoListingsYet")}</Card>
        )}

        {/* LIST */}
        <div style={{ display: "grid", gap: 12 }}>
          {visibleItems.map(x => {
            const imageUrl = x.coverImageUrl
              ? x.coverImageUrl.startsWith("http")
                ? x.coverImageUrl
                : `${API_BASE_URL}${x.coverImageUrl}`
              : "/images/placeholder.png";

            return (
              <Card key={x.id}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: 14,
                    alignItems: "center"
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      width: 80,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: "#f2f2f2",
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />

                  {/* INFO */}
                  <div>
                    <div style={{ fontWeight: 800 }}>
                      {x.title || t("common.Untitled")}
                    </div>

                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 14
                      }}
                    >
                      {x.price > 0
                        ? `${x.price} ${x.currency}`
                        : t("common.PriceNotSet")}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)"
                      }}
                    >
                      {t("common.Status")}: {x.status}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        nav(`/me/listings/${x.id}/edit`)
                      }
                    >
                      {t("common.Edit")}
                    </button>

                    <button
                      onClick={() => del.mutate(x.id)}
                      style={{ color: "#b91c1c" }}
                    >
                      {t("common.Delete")}
                    </button>

                    <button
                      onClick={() => publish.mutate(x.id)}
                      disabled={x.status !== 0}
                    >
                      {t("common.Publish")}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
