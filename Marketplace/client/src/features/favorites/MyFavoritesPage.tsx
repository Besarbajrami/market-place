import { useState } from "react";
import { useMyFavorites } from "./useFavorite";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { useTranslation } from "react-i18next";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

export function MyFavoritesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyFavorites(page, 20);
  const nav = useNavigate();
  const { t } = useTranslation();

  if (isLoading) return <div>{t("common.LoadingFavorites")}...</div>;

  return (
    <Container>
      <h1>{t("common.MyFavorites")}</h1>

      <div style={{ display: "grid", gap: 12 }}>
        {data?.items.map(f => {
          const imageUrl = f.coverImageUrl
            ? f.coverImageUrl.startsWith("http")
              ? f.coverImageUrl
              : `${API_BASE_URL}${f.coverImageUrl}`
            : "/images/placeholder.png";

          return (
            <Card
              key={f.listingId}
              onClick={() => nav(`/listings/${f.listingId}`)}
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr",
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
                  <div style={{ fontWeight: 800 }}>{f.title}</div>

                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {f.city}
                  </div>

                  <div style={{ fontWeight: 700, marginTop: 4 }}>
                    {f.price} {f.currency}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
