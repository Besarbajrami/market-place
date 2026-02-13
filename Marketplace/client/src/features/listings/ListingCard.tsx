import { slugify } from "../../shared/slug";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddFavorite, useRemoveFavorite } from "../favorites/useFavorite";
import { useMemo, useState, useEffect, useRef } from "react";

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
    images?: { url: string }[]; // ✅ NEW
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

  const [isFavorite, setIsFavorite] = useState(!!listing.isFavorite);
  const [isMobile, setIsMobile] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

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

  const currentImage =
    resolvedImages[currentIndex] || "/images/placeholder.png";

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

  const containerStyle: React.CSSProperties = {
    cursor: "pointer",
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "140px 1fr",
    gap: isMobile ? 10 : 14,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "var(--shadow)",
    position: "relative"
  };

  return (
    <div
      onClick={() =>
        nav(`/listings/${listing.id}/${slugify(listing.title)}`)
      }
      style={containerStyle}
    >
      {/* IMAGE SLIDER */}
      <div
        style={{
          position: "relative",
          width: isMobile ? "100%" : 140,
          height: isMobile ? 180 : 110,
          overflow: "hidden",
          background: "#f2f2f2"
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
      {resolvedImages.map((img, i) => (
  <div
    key={i}
    style={{
      flex: "0 0 100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f3f4f6"
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

        {/* ARROWS – Desktop only */}
        {!isMobile &&
          isHovering &&
          resolvedImages.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={prevImage}
                  style={arrowLeftStyle}
                >
                  ‹
                </button>
              )}

              {currentIndex < resolvedImages.length - 1 && (
                <button
                  onClick={nextImage}
                  style={arrowRightStyle}
                >
                  ›
                </button>
              )}
            </>
          )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: isMobile ? 12 : "10px 10px 10px 0" }}>
        <div style={{ fontWeight: 800 }}>
          {listing.title}
        </div>

        <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>
          {listing.categoryName && <>{listing.categoryName} · </>}
          {listing.publishedAt &&
            new Date(listing.publishedAt).toLocaleDateString()}
        </div>

        <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
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
          setIsFavorite(next);
          (next
            ? addFavorite.mutateAsync(listing.id)
            : removeFavorite.mutateAsync(listing.id)
          ).catch(() => setIsFavorite(!next));
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

      {isFeatured && (
        <div style={badgeFeaturedStyle}>
          {t("common.FEATURED")}
        </div>
      )}

      {isUrgent && (
        <div style={badgeUrgentStyle}>
          {t("common.URGENT")}
        </div>
      )}
    </div>
  );
}

const arrowLeftStyle: React.CSSProperties = {
  position: "absolute",
  left: 6,
  top: "50%",
  transform: "translateY(-50%)",
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "none",
  background: "rgba(0,0,0,0.5)",
  color: "white",
  cursor: "pointer"
};

const arrowRightStyle = {
  ...arrowLeftStyle,
  left: "auto",
  right: 6
};

const badgeFeaturedStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  left: 8,
  background: "#ffd700",
  fontSize: 11,
  fontWeight: 800,
  padding: "4px 6px",
  borderRadius: 6
};

const badgeUrgentStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  left: 70,
  background: "#e53935",
  color: "white",
  fontSize: 11,
  fontWeight: 800,
  padding: "4px 6px",
  borderRadius: 6
};