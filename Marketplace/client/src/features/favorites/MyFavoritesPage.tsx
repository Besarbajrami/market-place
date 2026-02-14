import { useState, useEffect } from "react";
import { useMyFavorites, useRemoveFavorite } from "./useFavorite";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/useAuth";
import {
  getGuestFavorites,
  removeGuestFavorite
} from "./localFavorites";
import { useListingDetails } from "../listings/useListingDetails";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function MyFavoritesPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const { t } = useTranslation();

  const [page] = useState(1);
  const { data, isLoading } = useMyFavorites(page, 20, !!user);
  const removeFavorite = useRemoveFavorite();

  // 🔥 Guest state (reactive, no reload)
  const [guestIds, setGuestIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setGuestIds(getGuestFavorites());
    }
  }, [user]);

  if (user && isLoading) {
    return <div>{t("common.LoadingFavorites")}...</div>;
  }

  return (
    <Container>
      <h1>{t("common.MyFavorites")}</h1>

      <div style={{ display: "grid", gap: 12 }}>

        {/* ========================= */}
        {/* LOGGED USER FAVORITES */}
        {/* ========================= */}
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
                style={{ cursor: "pointer", position: "relative" }}
              >
                {/* REMOVE BUTTON */}
                <button
                  onClick={async e => {
                    e.stopPropagation();
                    await removeFavorite.mutateAsync(f.listingId);
                  }}
                  style={removeButtonStyle}
                >
                 x
                </button>

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
                    <div style={{ fontWeight: 800 }}>
                      {f.title}
                    </div>

                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 13
                      }}
                    >
                      {f.city}
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        marginTop: 4
                      }}
                    >
                      {f.price} {f.currency}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

        {/* ========================= */}
        {/* GUEST FAVORITES */}
        {/* ========================= */}
        {!user &&
          guestIds.map(id => (
            <GuestFavoriteCard
              key={id}
              id={id}
              onRemove={() => {
                removeGuestFavorite(id);
                setGuestIds(prev =>
                  prev.filter(x => x !== id)
                );
              }}
            />
          ))}

        {/* EMPTY STATES */}
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

/* ===================================== */
/* Guest Card Component (SAFE HOOK USAGE) */
/* ===================================== */

function GuestFavoriteCard({
  id,
  onRemove
}: {
  id: string;
  onRemove: () => void;
}) {
  const nav = useNavigate();
  const { data: listing } = useListingDetails(id);

  if (!listing) return null;

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const imageUrl =
    listing.images?.length
      ? listing.images[0].url.startsWith("http")
        ? listing.images[0].url
        : `${API_BASE_URL}${listing.images[0].url}`
      : "/images/placeholder.png";

  return (
    <Card
      onClick={() => nav(`/listings/${id}`)}
      style={{ cursor: "pointer", position: "relative" }}
    >
      {/* REMOVE BUTTON */}
      <button
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        style={removeButtonStyle}
      >
        x
      </button>

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
          <div style={{ fontWeight: 800 }}>
            {listing.title}
          </div>

          <div
            style={{
              color: "var(--muted)",
              fontSize: 13
            }}
          >
            {listing.city}
            {listing.region &&
              ` · ${listing.region}`}
          </div>

          <div
            style={{
              fontWeight: 700,
              marginTop: 4
            }}
          >
            {listing.price} {listing.currency}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ===================================== */
/* Remove Button Style */
/* ===================================== */

const removeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  background: "transparent",
  border: 0,
  fontSize: 18,
  cursor: "pointer",
  color: "#e53935"
};
