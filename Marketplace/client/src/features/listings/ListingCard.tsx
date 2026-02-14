import { slugify } from "../../shared/slug";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddFavorite, useRemoveFavorite } from "../favorites/useFavorite";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/useAuth";
import {
  addGuestFavorite,
  removeGuestFavorite,
  isGuestFavorite
} from "../favorites/localFavorites";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Props {
  listing: {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    region?: string;
    coverImageUrl?: string | null;
    images?: { url: string }[];
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
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(() => {
    if (user) return !!listing.isFavorite;
    return isGuestFavorite(listing.id);
  });

  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!user) setIsFavorite(isGuestFavorite(listing.id));
  }, [user, listing.id]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const images = listing.images?.length
    ? listing.images
    : listing.coverImageUrl
    ? [{ url: listing.coverImageUrl }]
    : [];

  const resolvedImages = images.map(img => {
    const url = img.url;
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  });

  const isFeatured = listing.featuredUntil && new Date(listing.featuredUntil) > new Date();
  const isUrgent = listing.urgentUntil && new Date(listing.urgentUntil) > new Date();

  function nextImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (currentIndex < resolvedImages.length - 1) setCurrentIndex(i => i + 1);
  }

  function prevImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) nextImage();
    if (distance < -50) prevImage();
  }

  const arrowStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    [side]: 8,
    top: "50%",
    transform: "translateY(-50%)",
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1px solid var(--border)",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  });

  const badgeStyle = (bg: string, left = 10): React.CSSProperties => ({
    position: "absolute",
    top: 10,
    left,
    background: bg,
    color: "#fff",
    fontSize: 11,
    fontWeight: 800,
    padding: "5px 8px",
    borderRadius: 8,
    boxShadow: "var(--shadow-sm)"
  });

  return (
    <div
      onClick={() => nav(`/listings/${listing.id}/${slugify(listing.title)}`)}
      style={{
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
        gap: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
        transition: "var(--transition-base)",
        color: "var(--text-primary)"
      }}
    >
      {/* IMAGE SLIDER */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "100%" : 140,
          height: isMobile ? 180 : 110,
          overflow: "hidden",
          background: "var(--bg-soft)"
        }}
        onMouseEnter={() => !isMobile && setIsHovering(true)}
        onMouseLeave={() => !isMobile && setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.35s ease"
          }}
        >
          {(resolvedImages.length ? resolvedImages : ["/images/placeholder.png"]).map((img, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-soft)"
              }}
            >
              <img
                src={img}
                alt={listing.title}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        {/* Arrows (desktop hover) */}
        {!isMobile && isHovering && resolvedImages.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button onClick={prevImage} style={arrowStyle("left")}>
                ‹
              </button>
            )}
            {currentIndex < resolvedImages.length - 1 && (
              <button onClick={nextImage} style={arrowStyle("right")}>
                ›
              </button>
            )}
          </>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: isMobile ? 12 : "10px 12px 10px 0" }}>
        {/* Title */}
        <div style={{ fontWeight: 800, color: "var(--text-primary)" }}>
          {listing.title}
        </div>

        {/* Category + Date */}
        <div style={{ marginTop: 4, fontSize: 12, color: "var(--text-muted)" }}>
          {listing.categoryName && <>{listing.categoryName} · </>}
          {listing.publishedAt && new Date(listing.publishedAt).toLocaleDateString()}
        </div>

        {/* City + Region */}
        <div style={{ marginTop: 6, fontSize: 13, color: "var(--text-secondary)" }}>
          <span style={{ opacity: 0.7 }}>📍</span> {listing.city}
          {listing.region && ` · ${listing.region}`}
        </div>

        {/* Price */}
        <div style={{ marginTop: 10, fontSize: 18, fontWeight: 900, color: "var(--text-primary)" }}>
          {listing.price} {listing.currency}
        </div>
      </div>

      {/* FAVORITE */}
      <button
        onClick={async e => {
          e.stopPropagation();
          const next = !isFavorite;
          setIsFavorite(next);

          try {
            if (user) {
              if (next) await addFavorite.mutateAsync(listing.id);
              else await removeFavorite.mutateAsync(listing.id);
            } else {
              if (next) addGuestFavorite(listing.id);
              else removeGuestFavorite(listing.id);
            }
          } catch {
            setIsFavorite(!next);
          }
        }}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          cursor: "pointer",
          fontSize: 16,
          color: isFavorite ? "var(--primary)" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      {/* BADGES */}
      {isFeatured && <div style={badgeStyle("var(--secondary)", 10)}>⭐ {t("common.FEATURED")}</div>}
      {isUrgent && <div style={badgeStyle("var(--primary)", isFeatured ? 110 : 10)}>🔥 {t("common.URGENT")}</div>}
    </div>
  );
}
