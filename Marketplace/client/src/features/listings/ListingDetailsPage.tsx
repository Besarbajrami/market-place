import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useListingDetails } from "./useListingDetails";
import { useAuth } from "../../auth/useAuth";
import { http } from "../../api/http";
import { useAddFavorite, useRemoveFavorite } from "../favorites/useFavorite";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";
import { Badge } from "../../shared/ui/Badge";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img
        src={imageUrl}
        alt={data.title}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain"
        }}
      />

          {images.length > 1 && (
            <>
              <button onClick={prevImage}>‹</button>
              <button onClick={nextImage}>›</button>
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