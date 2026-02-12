import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useListingDetails } from "./useListingDetails";
import { useAuth } from "../../auth/useAuth";
import { http } from "../../api/http";
import { useAddFavorite, useRemoveFavorite } from "../favorites/useFavorite";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { Badge } from "../../shared/ui/Badge";
import { useTranslation } from "react-i18next";
import { useState } from "react";
export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useListingDetails(id ?? "");
  const nav = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const addFav = useAddFavorite();
  const removeFav = useRemoveFavorite();
  const { t } = useTranslation();

  if (isLoading) return <div>Loading listing...</div>;
  if (isError || !data) return <div>Listing not found.</div>;
  const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7012";
  const isOwner =
  isAuthenticated && user?.id === data.sellerId;
  const images = data.images ?? [];

  const initialIndex =
    images.findIndex(i => i.isCover) >= 0
      ? images.findIndex(i => i.isCover)
      : 0;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const currentImage = images[currentIndex];
  
  const imageUrl =
    currentImage?.url
      ? currentImage.url.startsWith("http")
        ? currentImage.url
        : `${API_BASE_URL}${currentImage.url}`
      : "/images/placeholder.png";
  
  function nextImage() {
    if (images.length <= 1) return;
    setCurrentIndex(i => (i + 1) % images.length);
  }
  
  function prevImage() {
    if (images.length <= 1) return;
    setCurrentIndex(i =>
      i === 0 ? images.length - 1 : i - 1
    );
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


  // const imageUrl = coverImage.url
  //   ? `${API_BASE_URL}${coverImage.url}`
  //   : "/images/placeholder.png";


  return (
    <Container>
      {/* COVER IMAGE */}
      {images.length > 0 && (
  <div style={{ position: "relative" }}>
    <img
      src={imageUrl}
      alt={data.title}
      style={{
        width: "100%",
        maxHeight: 500,
        objectFit: "contain",
        borderRadius: 12,
        marginBottom: 16,
        background: "#f3f4f6"
      }}
    />

    {images.length > 1 && (
      <>
        {/* LEFT */}
        <button
          onClick={prevImage}
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            cursor: "pointer",
            padding: 0
          }}
        >
          ‹
        </button>

        {/* RIGHT */}
        <button
          onClick={nextImage}
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            cursor: "pointer",
            padding: 0
          }}
        >
          ›
        </button>
      </>
    )}
  </div>
)}

      {/* TITLE + SAVE */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <h1 style={{ margin: 0 }}>{data.title}</h1>

        <button
          onClick={toggleFavorite}
          style={{
            border: "1px solid var(--border)",
            background: data.isFavorite ? "#fff1f2" : "white",
            borderRadius: 999,
            padding: "6px 14px",
            fontWeight: 600
          }}
        >
          {data.isFavorite ? "★ Saved" : "☆ Save"}
        </button>
      </div>

      {/* META */}
      <div style={{ color: "var(--muted)", marginTop: 6 }}>
        {data.city} · {data.region} · {data.condition}
        {data.category?.name && <> · {data.category.name}</>}
      </div>

      {/* BADGES */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {data.isFeatured && <Badge text="FEATURED" tone="success" />}
        {data.isUrgent && <Badge text="URGENT" tone="danger" />}
      </div>

      {/* MAIN CONTENT */}
      <div className="listing-grid" style={{ marginTop: 20 }}>
        {/* LEFT */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* THUMBNAILS */}
          {data.images.length > 1 && (
            <Card padding={12}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                  gap: 8
                }}
              >
             {images.map((img, index) => (
                  
                  <img
                  key={img.id}
                  onClick={() => setCurrentIndex(index)}
                  src={
                    img.url.startsWith("http")
                      ? img.url
                      : `${API_BASE_URL}${img.url}`
                  }
                  alt=""
                  style={{
                    width: "100%",
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 6,
                    cursor: "pointer",
                    border:
                      index === currentIndex
                        ? "2px solid var(--primary)"
                        : "1px solid var(--border)"
                  }}
                />
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h3>{t("common.Description")}  </h3>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {data.description}
            </p>
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display: "grid", gap: 16 }}>
          <Card>
            <div style={{ fontSize: 30, fontWeight: 800 }}>
              {data.price} {data.currency}
            </div>

            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            {t("common.Views")} : {data.viewCount}
            </div>
            {!isOwner && (
            <button
              onClick={onContactSeller}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "14px",
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 12,
                border: "none",
                background: "var(--primary)",
                color: "white"
              }}
            >
             {t("common.ContactSeller")} 
            </button>
            )}
          </Card>

          <Card>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {t("common.Seller")}
            </div>

            <button
              onClick={() => nav(`/seller/${data.sellerId}`)}
              style={{
                background: "none",
                border: 0,
                padding: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "var(--primary)"
              }}
            >
              {data.seller?.displayName ?? "Seller"}
            </button>

            <button
              onClick={() => nav(`/seller/${data.sellerId}`)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "white"
              }}
            >
            {t("common.ViewSellerListings")} 
            </button>
          </Card>
        </div>
      </div>

      {/* MOBILE STICKY CTA */}
      {!isOwner && (
      <div
        style={{
          position: "sticky",
          bottom: 0,
          marginTop: 24,
          padding: 12,
          background: "white",
          borderTop: "1px solid var(--border)"
        }}
        className="mobile-only"
      >
        <button
          onClick={onContactSeller}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 12,
            border: "none",
            background: "var(--primary)",
            color: "white"
          }}
        >
        {t("common.ContactSeller")}  
        </button>
      </div>
      )}
    </Container>
  );
}
