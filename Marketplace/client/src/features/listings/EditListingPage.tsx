import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  useUpdateListing,
  useUploadListingImages,
  useSetListingCoverImage
} from "./useMyListings";

import { useListingForEdit } from "./useListingForEdit";
import { useListingDetails } from "./useListingDetails";
import { useCategories } from "../categories/useCategories";
import { CategorySelect } from "../categories/CategorySelect";
import { useCategoryAttributes } from "../categories/hooks/useCategoryAttributes";
import {
  DynamicAttributesForm,
  type AttributeValueMap
} from "./component/DynamicAttributesForm";
import { ListingImagesEditor } from "./ListingImagesEditor";
import { useCities, useCountries } from "../hooks/useLocations";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

type EditImage = {
  id: string;
  url: string;
  isCover: boolean;
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export function EditListingPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listingId = id!;

  const update = useUpdateListing();
  const upload = useUploadListingImages();
  const setCover = useSetListingCoverImage();

  const { data: categories } = useCategories();
  const { data: editData, isLoading } = useListingForEdit(listingId);
  const { data: details } = useListingDetails(listingId);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  /* ---------------- Form state ---------------- */
  const [country, setCountry] = useState("MK"); // default Macedonia

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCities(country || null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [condition, setCondition] = useState("used");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<EditImage[]>([]);
  const [attributeValues, setAttributeValues] =
    useState<AttributeValueMap>({});

  const { data: categoryAttributes = [] } =
    useCategoryAttributes(categoryId || null);

  // ✅ form-level error message from backend
  const [formError, setFormError] = useState<string | null>(null);

  // ✅ NEW: upload loading indicator
  const [isUploading, setIsUploading] = useState(false);

  /* ---------------- Init sync ---------------- */

  useEffect(() => {
    if (!editData) return;

    setTitle(editData.title ?? "");
    setDescription(editData.description ?? "");
    setPrice(editData.price ? String(editData.price) : "");
    setCurrency(editData.currency ?? "EUR");
    setCountry(editData.locationCountryCode ?? "MK");

    setCity(editData.city ?? "");
    setRegion(editData.region ?? "");
    setCondition(editData.condition ?? "used");
    setCategoryId(editData.categoryId ?? "");

    const map: AttributeValueMap = {};
    editData.attributes?.forEach(a => {
      map[a.categoryAttributeId] = a.value;
    });
    setAttributeValues(map);

    // clear old error on load
    setFormError(null);
  }, [editData]);

  useEffect(() => {
    if (!details?.images) return;
    setImages(
      details.images.map(i => ({
        id: i.id,
        // ✅ normalize URL for editor display
        url: i.url.startsWith("http") ? i.url : `${API_BASE_URL}${i.url}`,
        isCover: i.isCover
      }))
    );
  }, [details, API_BASE_URL]);

  /* ---------------- Actions ---------------- */

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    try {
      await update.mutateAsync({
        id: listingId,
        payload: {
          categoryId,
          title,
          description,
          price: Number(price) || 0,
          currency,
          countryCode: country,
          city,
          region,
          condition,
          attributes: Object.entries(attributeValues).map(
            ([categoryAttributeId, value]) => ({
              categoryAttributeId,
              value
            })
          )
        }
      });

      navigate("/me/listings");
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.title ||
        err?.message;

      const dict = err?.response?.data?.errors;
      const firstDictError =
        dict && typeof dict === "object"
          ? Object.values(dict)?.flat?.()?.[0]
          : null;

      setFormError(
        firstDictError ||
          serverMessage ||
          (t("common.SomethingWentWrong") as any) ||
          "Something went wrong"
      );
    }
  }

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // ✅ allow selecting same file again later
    e.target.value = "";

    setIsUploading(true);
    setFormError(null);

    upload.mutate(
      { listingId, files },
      {
        onSuccess: uploaded => {
          setImages(prev => [
            ...prev,
            ...uploaded.map(i => ({
              id: i.imageId,
              // ✅ normalize URL for immediate preview
              url: i.url.startsWith("http") ? i.url : `${API_BASE_URL}${i.url}`,
              isCover: i.isCover
            }))
          ]);
          setIsUploading(false);
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Upload failed";
          setFormError(msg);
          setIsUploading(false);
        }
      }
    );
  }

  const canSubmit =
    title.trim().length > 0 &&
    !!categoryId &&
    images.length > 0;

  if (isLoading) return <div>{t("common.loading")}</div>;
  if (!editData) return <div>{t("common.NotFound")}</div>;

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */

  return (
    <div
      style={{
        margin: "20px auto",
        padding: 16,
        maxWidth: 760
      }}
    >
      <h1>{t("common.Edit") || "Edit listing"}</h1>

      <form onSubmit={onSubmit}>
        <Card>
          {/* CATEGORY */}
          <Section title={t("") || ""}>
            <CategorySelect
              categories={categories!}
              value={categoryId}
              onChange={setCategoryId}
            />
          </Section>

          {/* BASIC INFO */}
          <Section title={t("") || ""}>
            <input
              placeholder={t("common.Title") || "Title"}
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                width: "100%"
              }}
            />

            <textarea
              placeholder={t("common.Description") || "Description"}
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                width: "100%",
                minHeight: 110
              }}
            />
          </Section>

          {/* PRICE & LOCATION */}
          <Section title={t("") || ""}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="number"
                placeholder={t("common.Price") || "Price"}
                value={price}
                onChange={e => setPrice(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 160,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)"
                }}
              />

              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                style={{
                  minWidth: 120,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)"
                }}
              >
                <option value="EUR">EUR</option>
                <option value="MKD">MKD</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {/* COUNTRY */}
              <select
                value={country}
                onChange={e => {
                  setCountry(e.target.value);
                  setCity("");
                }}
                style={{
                  flex: "0 0 140px",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  display: "none"
                }}
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* CITY */}
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 200,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border)"
                }}
              >
                <option value="">
                  {t("common.City") || "Select city"}
                </option>
                {cities.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          {/* ATTRIBUTES (OPTIONAL) */}
          {/* {categoryAttributes.length > 0 && (
            <Section title={t("common.Additional") || "Additional details"}>
              <DynamicAttributesForm
                attributes={categoryAttributes}
                values={attributeValues}
                onChange={setAttributeValues}
              />
            </Section>
          )} */}

          {/* IMAGES */}
          <Section title={t("common.Images") || "Images"}>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onFilesSelected}
              disabled={isUploading}
              style={{
                padding: "10px 0",
                opacity: isUploading ? 0.6 : 1
              }}
            />

            {isUploading && (
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
                Uploading images...
              </div>
            )}

            <ListingImagesEditor
              images={images}
              listingId={listingId}
              setImages={setImages}
              setCover={setCover}
            />
          </Section>

          {/* Error box */}
          {formError && (
            <div
              style={{
                background: "#fdecea",
                color: "#b71c1c",
                padding: 12,
                borderRadius: 10,
                fontSize: 14,
                marginTop: 12
              }}
            >
              {formError}
            </div>
          )}

          {/* SAVE */}
          <PrimaryButton type="submit" disabled={!canSubmit || update.isPending}>
            {update.isPending
              ? t("common.Saving") || "Saving..."
              : t("common.Save") || "Save listing"}
          </PrimaryButton>
        </Card>
      </form>
    </div>
  );
}

/* ---------------------------------- */
/* UI Components                      */
/* ---------------------------------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
      }}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3>{title}</h3>
      <div style={{ display: "grid", gap: 12 }}>{children}</div>
    </div>
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        marginTop: 12,
        padding: "12px 18px",
        borderRadius: 10,
        border: 0,
        background: "#1976d2",
        color: "white",
        fontWeight: 700,
        opacity: props.disabled ? 0.5 : 1,
        width: "100%"
      }}
    />
  );
}