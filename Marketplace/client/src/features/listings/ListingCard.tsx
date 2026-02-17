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

interface ListingImage {
  url: string;
}

interface ListingDto {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  region?: string;
  coverImageUrl?: string | null;
  images?: ListingImage[];
  featuredUntil?: string | null;
  urgentUntil?: string | null;
  categoryName?: string;
  publishedAt?: string;
  isFavorite?: boolean;
}

interface Props {
  listing: ListingDto;
  isAdminView?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ListingCard({
  listing,
  isAdminView = false,
  onApprove,
  onReject
}: Props) {
  const nav = useNavigate();
  const { t } = useTranslation();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { user } = useAuth();

  const [isFavorite, setIsFavorite] = useState(() => {
    if (user) return !!listing.isFavorite;
    return isGuestFavorite(listing.id);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!user) setIsFavorite(isGuestFavorite(listing.id));
  }, [user, listing.id]);

  const images =
    listing.images?.length
      ? listing.images
      : listing.coverImageUrl
      ? [{ url: listing.coverImageUrl }]
      : [];

  const resolvedImages = images.map(img =>
    img.url.startsWith("http")
      ? img.url
      : `${API_BASE_URL}${img.url}`
  );

  const isFeatured =
    listing.featuredUntil &&
    new Date(listing.featuredUntil) > new Date();

  const isUrgent =
    listing.urgentUntil &&
    new Date(listing.urgentUntil) > new Date();

  function nextImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (currentIndex < resolvedImages.length - 1)
      setCurrentIndex(i => i + 1);
  }

  function prevImage(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (currentIndex > 0)
      setCurrentIndex(i => i - 1);
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
        !isAdminView &&
        nav(`/listings/${listing.id}/${slugify(listing.title)}`)
      }
      style={{
        cursor: isAdminView ? "default" : "pointer",
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 14,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        color: "var(--text-primary)"
      }}
    >
      {/* IMAGE */}
      <div
        style={{
          position: "relative",
          width: 140,
          height: 110,
          overflow: "hidden",
          background: "#f3f4f6"
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
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
          {(resolvedImages.length
            ? resolvedImages
            : ["/images/placeholder.png"]
          ).map((img, i) => (
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

        {!isAdminView &&
          isHovering &&
          resolvedImages.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button onClick={prevImage} style={arrow("left")}>‹</button>
              )}
              {currentIndex < resolvedImages.length - 1 && (
                <button onClick={nextImage} style={arrow("right")}>›</button>
              )}
            </>
          )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "10px 12px 10px 0" }}>
        <div style={{ fontWeight: 800 }}>
          {listing.title}
        </div>

        <div style={{ marginTop: 6 }}>
          📍 {listing.city}
          {listing.region && ` · ${listing.region}`}
        </div>

        <div style={{ marginTop: 10, fontWeight: 900 }}>
          {listing.price} {listing.currency}
        </div>
      </div>

      {/* ADMIN ACTIONS */}
      {isAdminView && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            display: "flex",
            gap: 6
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.();
            }}
            style={adminApprove}
          >
            Approve
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject?.();
            }}
            style={adminReject}
          >
            Reject
          </button>
        </div>
      )}

      {isFeatured && (
        <div style={badge("var(--secondary)", 8)}>⭐</div>
      )}
      {isUrgent && (
        <div style={badge("var(--primary)", 70)}>🔥</div>
      )}
    </div>
  );
}

const arrow = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  [side]: 6,
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

const badge = (bg: string, left: number): React.CSSProperties => ({
  position: "absolute",
  top: 8,
  left,
  background: bg,
  color: "white",
  padding: "4px 6px",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700
});

const adminApprove: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: 0,
  background: "#2e7d32",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
};

const adminReject: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: 0,
  background: "#d32f2f",
  color: "white",
  fontWeight: 700,
  cursor: "pointer"
};
