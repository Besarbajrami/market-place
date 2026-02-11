import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  useCreateDraftListing,
  useUpdateListing,
  useUploadListingImages,
  usePublishListing
} from "./useMyListings";

import { useCategories } from "../categories/useCategories";
import { CategorySelect } from "../categories/CategorySelect";

type DraftListingDto = {
  id: string;
};

export function QuickCreateListingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const createDraft = useCreateDraftListing();
  const update = useUpdateListing();
  const upload = useUploadListingImages();
  const publish = usePublishListing();

  const { data: categories, isLoading: catLoading } = useCategories();

  // --- Simple form state ---
  const [categoryId, setCategoryId] = useState<string>(""); // no nulls, just "" when empty
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // REQUIRED
  const [priceInput, setPriceInput] = useState("");
  const [currency, setCurrency] = useState<"MKD" | "EUR">("MKD");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;

    // You can either replace or append; append feels nicer
    setFiles(prev => [...prev, ...selected]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canSubmit) return;

    try {
      setSubmitting(true);

      // 1) Create draft
      const draft = (await createDraft.mutateAsync()) as DraftListingDto;
      const listingId = draft.id;

      // 2) Fill basics (with defaults)
      const price =
        priceInput.trim() === "" ? 0 : Number(priceInput.trim()) || 0;

      await update.mutateAsync({
        id: listingId,
        payload: {
          categoryId,
          title: title.trim(),
          description: description.trim(),
          price,
          currency,
          city: "",
          region: "",
          condition: "used",
          attributes: [] // ✅ REQUIRED by backend contract
        }
      });

      // 3) Upload images
      await upload.mutateAsync({ listingId, files });

      // 4) Publish
      await publish.mutateAsync(listingId);

      // 5) Go to listing details
      navigate(`/listings/${listingId}`);
    } catch (err) {
      console.error(err);
      // If your ApiControllerBase returns domain code/message,
      // you can inspect err.response.data in your hook and surface it here.
      alert(t("common.SomethingWentWrong") || "Failed to create listing.");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit =
    !!categoryId &&
    !!title.trim() &&
    !!description.trim() && // 🔴 Description required
    files.length > 0 &&
    !submitting;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>{t("listing.CreateFast") || "Create listing (fast)"}</h1>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        {t("listing.QuickCreateHint") ||
          "Choose a category, add a title, description and images. Price is optional."}
      </p>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 14, alignItems: "flex-start" }}
      >
        {/* Category */}
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            {t("listing.Category") || "Category"}{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          {catLoading && (
            <div>{t("common.loading") || "Loading categories..."}</div>
          )}

          {categories && (
            <CategorySelect
              categories={categories}
              value={categoryId}
              onChange={id => setCategoryId(id)}
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            {t("listing.Title") || "Title"}{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t("listing.TitlePlaceholder") || "e.g. Golf 5 1.9 TDI"}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Description (REQUIRED) */}
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            {t("listing.Description") || "Description"}{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{ width: "100%", padding: 8 }}
            placeholder={
              t("listing.DescriptionPlaceholder") ||
              "Add details about condition, mileage, extras..."
            }
          />
        </div>

        {/* Price (optional) + Currency */}
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            {t("listing.PriceOptional") || "Price (optional)"}
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
              placeholder="e.g. 12345"
              style={{ flex: 1, padding: 8 }}
            />
            <select
              value={currency}
              onChange={e =>
                setCurrency(e.target.value as "EUR" | "MKD")
              }
              style={{ padding: 8 }}
            >
              <option value="MKD">
                {t("currency.MKD") || "MKD"}
              </option>
              <option value="EUR">
                {t("currency.EUR") || "EUR"}
              </option>
            </select>
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            {t("listing.DefaultCurrencyHint") ||
              "Default currency: MKD"}
          </div>
        </div>

        {/* Images */}
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>
            {t("listing.Images") || "Images"}{" "}
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onFilesSelected}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
            {t("listing.ImagesHint") ||
              "At least one image is required. Max 10 per upload (backend limit)."}
          </div>

          {/* Preview thumbnails */}
          {files.length > 0 && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 8,
                flexWrap: "wrap"
              }}
            >
              {files.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 120,
                    height: 90,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                    position: "relative"
                  }}
                >
                  <img
                    src={URL.createObjectURL(f)}
                    alt={f.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ marginTop: 8 }}>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: canSubmit ? "#1976d2" : "#ccc",
              color: "white",
              fontWeight: 600,
              cursor: canSubmit ? "pointer" : "not-allowed"
            }}
          >
            {submitting
              ? t("listing.Publishing") || "Publishing..."
              : t("listing.Publish") || "Publish listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
