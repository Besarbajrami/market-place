import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { resolveImageUrl } from "../../shared/utils/resolveImageUrl";
import { useTranslation } from "react-i18next";

type EditImage = {
  id: string;
  url: string;
  isCover: boolean;
};

interface Props {
  images: EditImage[];
  listingId: string;
  setImages: React.Dispatch<React.SetStateAction<EditImage[]>>;
  setCover: any;
}

export function ListingImagesEditor({
  images,
  listingId,
  setImages,
  setCover
}: Props) {
  const { t } = useTranslation();

  // Keep cover first
  const orderedImages = React.useMemo(() => {
    const cover = images.find(i => i.isCover);
    if (!cover) return images;
    return [cover, ...images.filter(i => i.id !== cover.id)];
  }, [images]);
  const isMobile = window.matchMedia("(max-width: 640px)").matches;

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1 },
    mode: "snap"
  });

  function setAsCover(imageId: string) {
    setCover.mutate(
      { listingId, imageId },
      {
        onSuccess: () => {
          setImages(prev =>
            prev.map(i => ({ ...i, isCover: i.id === imageId }))
          );
          slider.current?.moveToIdx(0);
        }
      }
    );
  }

  if (!orderedImages.length) {
    return <div>{t("common.NoImagesYet")}</div>;
  }

  return (
    <div style={{     maxWidth: isMobile ? 280 : 520 }}>
      {/* IMAGE + ARROWS */}
      <div
  style={{
    position: "relative",
    width: "100%",
    height: isMobile ? 220 : 320, // ✅ smaller on mobile
    borderRadius: 12,
    overflow: "hidden",
    background: "#000",
    marginBottom: 10
  }}
>

        {/* SLIDER */}
        <div ref={sliderRef} className="keen-slider">
          {orderedImages.map(img => (
            <div key={img.id} className="keen-slider__slide">
          <img
  src={resolveImageUrl(img.url)}
  alt=""
  style={{
    width: "100%",
    height: isMobile ? 220 : 320,
    objectFit: "contain",
    background: "#000"
  }}
/>


              {/* COVER BADGE */}
              {img.isCover && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "#1976d2",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700
                  }}
                >
                  {t("common.CoverImage")}
                </div>
              )}

              {/* SET AS COVER */}
              {!img.isCover && (
            <button
            type="button"
            onClick={() => setAsCover(img.id)}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              background: "rgba(0,0,0,0.55)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "4px 10px",
              borderRadius: 999,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              backdropFilter: "blur(4px)"
            }}
          >
            {t("common.SetAsCover")}
          </button>
          
              )}
            </div>
          ))}
        </div>

        {/* LEFT ARROW */}
        {orderedImages.length > 1 && (
       <button
       type="button"
       onClick={() => slider.current?.prev()}
       style={{
         position: "absolute",
         top: "50%",
         left: 12,
         transform: "translateY(-50%)",
         width: 36,
         height: 36,
         borderRadius: "50%",
         border: 0,
         background: "rgba(0,0,0,0.65)",
         color: "white",
         cursor: "pointer",
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         fontSize: 22,
         lineHeight: 1,
         paddingBottom:18 // 👈 optical centering
       }}
     >
       ‹
     </button>
     
        )}

        {/* RIGHT ARROW */}
        {orderedImages.length > 1 && (
         <button
         type="button"
         onClick={() => slider.current?.next()}
         style={{
           position: "absolute",
           top: "50%",
           right: 12,
           transform: "translateY(-50%)",
           width: 36,
           height: 36,
           borderRadius: "50%",
           border: 0,
           background: "rgba(0,0,0,0.65)",
           color: "white",
           cursor: "pointer",
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
           fontSize: 22,
           lineHeight: 1,
           paddingBottom: 18
         }}
       >
         ›
       </button>
       
        )}
      </div>

      {/* THUMBNAILS */}
      {orderedImages.length > 1 && (
        <div style={{ display: "flex", gap: 8 }}>
          {orderedImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => slider.current?.moveToIdx(idx)}
              style={{
                width: 80,
                height: 56,
                borderRadius: 8,
                backgroundImage: `url(${resolveImageUrl(img.url)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                border: img.isCover
                  ? "3px solid #1976d2"
                  : "2px solid #ccc"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
