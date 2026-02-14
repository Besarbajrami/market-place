import { slugify } from "../../shared/slug";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAddFavorite, useRemoveFavorite } from "../favorites/useFavorite";
import { useMemo, useState, useEffect, useRef } from "react";
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

  const resolvedImages = images.map(img => {
    const url = img.url;
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  });

  const currentImage = resolvedImages[currentIndex] || "/images/placeholder.png";

  const isFeatured = listing.featuredUntil && new Date(listing.featuredUntil) > new Date();
  const isUrgent = listing.urgentUntil && new Date(listing.urgentUntil) > new Date();

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
      onClick={() => nav(`/listings/${listing.id}/${slugify(listing.title)}`)}
      style={{
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "200px 1fr",
        gap: 0,
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: isHovering
          ? "0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
          : "0 10px 30px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovering ? "translateY(-4px)" : "translateY(0)"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Slider */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? 220 : 180,
          overflow: "hidden",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        }}
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
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
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
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                position: "relative"
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
              {/* Image overlay gradient */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40%",
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
                pointerEvents: "none"
              }} />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {!isMobile && isHovering && resolvedImages.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 107, 107, 0.8)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ‹
              </button>
            )}

            {currentIndex < resolvedImages.length - 1 && (
              <button
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 107, 107, 0.8)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 0, 0, 0.6)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ›
              </button>
            )}
          </>
        )}

        {/* Image counter dots */}
        {resolvedImages.length > 1 && (
          <div style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
            padding: "6px 10px",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            {resolvedImages.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === currentIndex 
                    ? "#ff6b6b" 
                    : "rgba(255, 255, 255, 0.4)",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ 
        padding: isMobile ? 20 : 24,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>
        <div style={{ 
          fontWeight: 700,
          fontSize: isMobile ? 16 : 18,
          color: "#fff",
          lineHeight: 1.3,
          letterSpacing: "-0.01em"
        }}>
          {listing.title}
        </div>

        <div style={{ 
          fontSize: 13,
          color: "rgba(255, 255, 255, 0.5)",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          {listing.categoryName && (
            <>
              <span style={{
                background: "rgba(78, 205, 196, 0.2)",
                padding: "2px 8px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                color: "#4ecdc4"
              }}>
                {listing.categoryName}
              </span>
              <span>•</span>
            </>
          )}
          {listing.publishedAt && new Date(listing.publishedAt).toLocaleDateString()}
        </div>

        <div style={{ 
          fontSize: 14,
          color: "rgba(255, 255, 255, 0.6)",
          display: "flex",
          alignItems: "center",
          gap: 6
        }}>
          <span style={{ opacity: 0.5 }}>📍</span>
          {listing.city}
          {listing.region && ` · ${listing.region}`}
        </div>

        <div style={{ 
          marginTop: "auto",
          paddingTop: 8,
          fontSize: isMobile ? 22 : 26,
          fontWeight: 900,
          background: "linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.02em"
        }}>
          {listing.price} {listing.currency}
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={async e => {
          e.stopPropagation();
          const next = !isFavorite;
          setIsFavorite(next);
          try {
            if (user) {
              if (next) {
                await addFavorite.mutateAsync(listing.id);
              } else {
                await removeFavorite.mutateAsync(listing.id);
              }
            } else {
              if (next) {
                addGuestFavorite(listing.id);
              } else {
                removeGuestFavorite(listing.id);
              }
            }
          } catch {
            setIsFavorite(!next);
          }
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: isFavorite 
            ? "rgba(255, 107, 107, 0.3)" 
            : "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
          cursor: "pointer",
          fontSize: 18,
          color: isFavorite ? "#ff6b6b" : "rgba(255, 255, 255, 0.7)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.15)";
          e.currentTarget.style.background = isFavorite 
            ? "rgba(255, 107, 107, 0.5)" 
            : "rgba(255, 255, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = isFavorite 
            ? "rgba(255, 107, 107, 0.3)" 
            : "rgba(0, 0, 0, 0.5)";
        }}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      {/* Featured Badge */}
      {isFeatured && (
        <div style={{
          position: "absolute",
          top: isMobile ? 12 : 12,
          left: isMobile ? 12 : 12,
          background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
          fontSize: 11,
          fontWeight: 800,
          padding: "6px 12px",
          borderRadius: 8,
          color: "#1a1a2e",
          boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          ⭐ {t("common.FEATURED")}
        </div>
      )}

      {/* Urgent Badge */}
      {isUrgent && (
        <div style={{
          position: "absolute",
          top: isMobile ? 12 : 12,
          left: isMobile ? (isFeatured ? 120 : 12) : (isFeatured ? 140 : 12),
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
          color: "white",
          fontSize: 11,
          fontWeight: 800,
          padding: "6px 12px",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(255, 107, 107, 0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          animation: "pulse 2s ease-in-out infinite"
        }}>
          🔥 {t("common.URGENT")}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
