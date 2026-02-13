import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useListingDetails } from "./useListingDetails";
import { useAuth } from "../../auth/useAuth";
import { http } from "../../api/http";
import { useAddFavorite, useRemoveFavorite } from "../favorites/useFavorite";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { Badge } from "../../shared/ui/Badge";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";

export function ListingDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;

  const { data, isLoading, isError } = useListingDetails(id);

  const nav = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const { t } = useTranslation();

  const images = data?.images ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (!images.length) return;

    const coverIndex = images.findIndex(i => i.isCover);
    setCurrentIndex(coverIndex >= 0 ? coverIndex : 0);
  }, [images]);

  if (!id) return <div>Invalid listing.</div>;
  if (isLoading) return <div>Loading listing...</div>;
  if (isError || !data) return <div>Listing not found.</div>;

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const isOwner =
    isAuthenticated && user?.id === data.sellerId;

  function nextImage() {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  }

  function prevImage() {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
    }
  }

  function toggleFavorite() {
    if (!data) return;

    if (!isAuthenticated) {
      nav("/login", { state: { from: location.pathname } });
      return;
    }

    data.isFavorite
      ? removeFav.mutate(data.id)
      : addFav.mutate(data.id);
  }

  async function onContactSeller() {
    if (!data) return;

    if (!user) {
      nav("/login", { state: { from: location.pathname } });
      return;
    }

    const res = await http.post("/api/conversations/start", {
      listingId: data.id
    });

    nav(`/inbox/${res.data.conversationId}`);
  }

  return (
    <Container>
      {images.length > 0 && (
        <div
          style={{
            position: "relative",
            height: "min(500px, 70vh)",
            width: "100%",
            background: "#f3f4f6",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* SLIDER TRACK */}
          <div
            style={{
              display: "flex",
              height: "100%",
              width: `${images.length * 100}%`,
              transform: `translateX(-${currentIndex * (100 / images.length)}%)`,
              transition: "transform 0.4s ease"
            }}
          >
            {images.map((img) => {
              const url =
                img.url.startsWith("http")
                  ? img.url
                  : `${API_BASE_URL}${img.url}`;

              return (
                <div
                  key={img.id}
                  style={{
                    flex: "0 0 100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img
                    src={url}
                    alt={data.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain"
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* ARROWS */}
          {images.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={prevImage}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    fontSize: 22,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ‹
                </button>
              )}

              {currentIndex < images.length - 1 && (
                <button
                  onClick={nextImage}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    fontSize: 22,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ›
                </button>
              )}
            </>
          )}
        </div>
      )}

      <h1>{data.title}</h1>

      <button onClick={toggleFavorite}>
        {data.isFavorite ? "★ Saved" : "☆ Save"}
      </button>

      <Card>
        <h3>{t("common.Description")}</h3>
        <p>{data.description}</p>
      </Card>

      <Card>
        <div>
          {data.price} {data.currency}
        </div>

        {!isOwner && (
          <button onClick={onContactSeller}>
            {t("common.ContactSeller")}
          </button>
        )}
      </Card>
    </Container>
  );
}