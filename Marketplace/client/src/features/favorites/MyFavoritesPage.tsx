import { useState } from "react";
import { useMyFavorites } from "./useFavorite";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/useAuth";
import { getGuestFavorites } from "./localFavorites";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

  export function MyFavoritesPage() {
    const { user } = useAuth();
    const nav = useNavigate();
    const { t } = useTranslation();
    const [page] = useState(1);
  
    // Backend favorites (only if logged in)
    const { data, isLoading } = useMyFavorites(page, 20, !!user);
  
    // Guest favorites
    const guestIds = !user ? getGuestFavorites() : [];
  
    if (user && isLoading) {
      return <div>{t("common.LoadingFavorites")}...</div>;
    }
  
    return (
      <Container>
        <h1>{t("common.MyFavorites")}</h1>
  
        <div style={{ display: "grid", gap: 12 }}>
          {user &&
            data?.items.map(f => {
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
                  <FavoriteCardContent
                    imageUrl={imageUrl}
                    title={f.title}
                    city={f.city}
                    price={f.price}
                    currency={f.currency}
                  />
                </Card>
              );
            })}
  
          {!user &&
            guestIds.map(id => (
              <Card
                key={id}
                onClick={() => nav(`/listings/${id}`)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ padding: 16 }}>
                  <div style={{ fontWeight: 700 }}>
                    {t("common.ViewListing")}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>
                    {id}
                  </div>
                </div>
              </Card>
            ))}
  
          {!user && guestIds.length === 0 && (
            <div style={{ color: "var(--muted)" }}>
              {t("common.NoFavorites")}
            </div>
          )}
  
          {user && data?.items.length === 0 && (
            <div style={{ color: "var(--muted)" }}>
              {t("common.NoFavorites")}
            </div>
          )}
        </div>
      </Container>
    );
  }
  function FavoriteCardContent({
    imageUrl,
    title,
    city,
    price,
    currency
  }: {
    imageUrl: string;
    title: string;
    city: string;
    price: number;
    currency: string;
  }) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr",
          gap: 14,
          alignItems: "center"
        }}
      >
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
  
        <div>
          <div style={{ fontWeight: 800 }}>{title}</div>
  
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            {city}
          </div>
  
          <div style={{ fontWeight: 700, marginTop: 4 }}>
            {price} {currency}
          </div>
        </div>
      </div>
    );
  }
  