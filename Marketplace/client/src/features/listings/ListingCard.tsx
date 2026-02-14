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
  const { user } = useAuth();

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const [isFavorite, setIsFavorite] = useState(() =>
    user ? !!listing.isFavorite : isGuestFavorite(listing.id)
  );

  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      setIsFavorite(isGuestFavorite(listing.id));
    }
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

  const resolvedImages = images.map(img =>
    img.url.startsWith("http") ? img.url : `${API_BASE_URL}${img.url}`
  );

  const isFeatured =
    listing.featuredUntil &&
    new Date(listing.featuredUntil) > new Date();

  const isUrgent =
    listing.urgentUntil &&
    new Date(listing.urgentUntil) > new Date();

  function nextImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (currentIndex < resolvedImages.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  }

  function prevImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
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

  return (
    <div
      onClick={() =>
        nav(`/listings/${listing.id}/${slugify(listing.title)}`)
      }
      style={{
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "160px 1fr",
        gap: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
        transition: "all 0.2s ease",
        color: "var(--text-primary)",
        transform: isHovering ? "translateY(-2px)" : "none"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* IMAGE */}
      <div
        style={{
          position: "relative",
          height: isMobile ? 200 : 140,
          overflow: "hidden",
          background: "var(--bg-light)"
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 0.35s ease"
          }}
        >
          {resolvedImages.map((img, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={img}
                alt={listing.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
          ))}
        </div>

        {!isMobile && resolvedImages.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button onClick={prevImage} style={arrowStyle("left")}>‹</button>
            )}
            {currentIndex < resolvedImages.length - 1 && (
              <button onClick={nextImage} style={arrowStyle("right")}>›</button>
            )}
          </>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: isMobile ? 14 : 16 }}>
        <div style={{ fontWeight: 700, fontSize: 17 }}>
          {listing.title}
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
          {listing.categoryName && <>{listing.categoryName} · </>}
          {listing.publishedAt &&
            new Date(listing.publishedAt).toLocaleDateString()}
        </div>

        <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
          📍 {listing.city}
          {listing.region && ` · ${listing.region}`}
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 20,
            fontWeight: 800,
            color: "var(--primary)"
          }}
        >
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
              next
                ? await addFavorite.mutateAsync(listing.id)
                : await removeFavorite.mutateAsync(listing.id);
            } else {
              next
                ? addGuestFavorite(listing.id)
                : removeGuestFavorite(listing.id);
            }
          } catch {
            setIsFavorite(!next);
          }
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: 34,
          height: 34,
          cursor: "pointer",
          fontSize: 16,
          color: isFavorite ? "var(--primary)" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 12px",
          transform: "scale(1)",
        }}
        
      >
        {isFavorite ? "♥" : "♡"}
      </button>
       
      {isFeatured && (
        <div style={badgeStyle("var(--secondary)")}>
          {t("common.FEATURED")}
        </div>
      )}

      {isUrgent && (
        <div style={badgeStyle("var(--primary)", 80)}>
          {t("common.URGENT")}
        </div>
      )}
    </div>
  );
}

const arrowStyle = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  [side]: 8,
  top: "50%",
  transform: "translateY(-50%)",
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  cursor: "pointer"
});

const badgeStyle = (bg: string, left = 10): React.CSSProperties => ({
  position: "absolute",
  top: 10,
  left,
  background: bg,
  color: "white",
  fontSize: 11,
  fontWeight: 700,
  padding: "4px 8px",
  borderRadius: 8
});
