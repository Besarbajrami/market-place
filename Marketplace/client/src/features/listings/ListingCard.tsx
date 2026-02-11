import { slugify } from "../../shared/slug";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useAddFavorite,
  useRemoveFavorite
} from "../favorites/useFavorite";
import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://localhost:7012";

interface Props {
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    region?: string;
    coverImageUrl?: string | null;
    featuredUntil?: string | null;
    urgentUntil?: string | null;

    categoryName?: string;
    publishedAt?: string;
    isFavorite?: boolean;
  };
}

export function ListingCard({ listing }: Props) {
  const nav = useNavigate();
  const { t } = useTranslation();

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  /* ---------------------------------- */
  /* ✅ LOCAL optimistic state           */
  /* ---------------------------------- */
  const [isFavorite, setIsFavorite] = useState(
    !!listing.isFavorite
  );

  const isFeatured =
    listing.featuredUntil &&
    new Date(listing.featuredUntil) > new Date();

  const isUrgent =
    listing.urgentUntil &&
    new Date(listing.urgentUntil) > new Date();

  const imageUrl = listing.coverImageUrl
    ? listing.coverImageUrl.startsWith("http")
      ? listing.coverImageUrl
      : `${API_BASE_URL}${listing.coverImageUrl}`
    : "/images/placeholder.png";

  return (
    <div
      onClick={() =>
        nav(`/listings/${listing.id}/${slugify(listing.title)}`)
      }
      style={{
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        position: "relative"
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          width: 140,
          height: 110,
          backgroundColor: "#f2f2f2",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* CONTENT */}
      <div style={{ padding: "10px 10px 10px 0" }}>
        <div style={{ fontWeight: 800, fontSize: 15 }}>
          {listing.title}
        </div>

        <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>
          {listing.categoryName && (
            <>
              {listing.categoryName} ·{" "}
            </>
          )}
          {listing.publishedAt &&
            new Date(listing.publishedAt).toLocaleDateString()}
        </div>

        <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 13 }}>
          {listing.city}
          {listing.region && ` · ${listing.region}`}
        </div>

        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 900 }}>
          {listing.price} {listing.currency}
        </div>
      </div>

      {/* FAVORITE */}
      <button
        onClick={e => {
          e.stopPropagation();

          const next = !isFavorite;
          setIsFavorite(next); // ✅ optimistic

          (next
            ? addFavorite.mutateAsync(listing.id)
            : removeFavorite.mutateAsync(listing.id)
          ).catch(() => {
            // rollback on error
            setIsFavorite(!next);
          });
        }}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "transparent",
          border: 0,
          fontSize: 18,
          cursor: "pointer"
        }}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      {/* BADGES */}
      {isFeatured && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#ffd700",
            fontSize: 11,
            fontWeight: 800,
            padding: "4px 6px",
            borderRadius: 6
          }}
        >
          {t("common.FEATURED")}
        </div>
      )}

      {isUrgent && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 80,
            background: "#e53935",
            color: "white",
            fontSize: 11,
            fontWeight: 800,
            padding: "4px 6px",
            borderRadius: 6
          }}
        >
          {t("common.URGENT")}
        </div>
      )}
    </div>
  );
}
