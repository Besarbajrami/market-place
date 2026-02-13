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

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function MyListingsPage() {
  const nav = useNavigate();
  const { data, isLoading } = useMyListings();
  const del = useDeleteListing();
  const publish = usePublishListing();
  const createDraft = useCreateDraftListing();
  const { t } = useTranslation();

  if (isLoading) return <div>Loading...</div>;

  const visibleItems =
    data?.items.filter(x => {
      if (x.status !== 0) return true;

      const hasTitle = x.title?.trim().length > 0;
      const hasPrice = x.price > 0;
      const hasImage = !!x.coverImageUrl;

      return hasTitle || hasPrice || hasImage;
    }) ?? [];

  return (
    <Container>
      <div style={{ display: "grid", gap: 20 }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
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
              padding: "10px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            + {t("common.NewListings")}
          </button>
        </div>

        {visibleItems.length === 0 && (
          <Card>{t("common.NoListingsYet")}</Card>
        )}

        <div style={{ display: "grid", gap: 16 }}>
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
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                  }}
                >
                  {/* TOP SECTION (Image + Info) */}
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      style={{
                        width: 110,
                        height: 85,
                        minWidth: 110,
                        borderRadius: 10,
                        backgroundColor: "#f3f4f6",
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />

                    {/* INFO */}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 16,
                          marginBottom: 4
                        }}
                      >
                        {x.title || t("common.Untitled")}
                      </div>

                      <div
                        style={{
                          color: "var(--muted)",
                          fontSize: 14,
                          marginBottom: 4
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
                  </div>

                  {/* ACTIONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap"
                    }}
                  >
                    <button
                      onClick={() =>
                        nav(`/me/listings/${x.id}/edit`)
                      }
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "white",
                        cursor: "pointer"
                      }}
                    >
                      {t("common.Edit")}
                    </button>

                    <button
                      onClick={() => del.mutate(x.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #fca5a5",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        cursor: "pointer"
                      }}
                    >
                      {t("common.Delete")}
                    </button>

                    <button
                      onClick={() => publish.mutate(x.id)}
                      disabled={x.status !== 0}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: 0,
                        background:
                          x.status === 0
                            ? "var(--primary)"
                            : "#e5e7eb",
                        color:
                          x.status === 0
                            ? "white"
                            : "#9ca3af",
                        cursor:
                          x.status === 0
                            ? "pointer"
                            : "not-allowed"
                      }}
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