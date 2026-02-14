import { useMemo, useState } from "react";
import { useListingsSearch } from "./useListingsSearch";
import type { ListingsSearchV2Params } from "./listingTypes";
import { useCategories } from "../categories/useCategories";
import { CategorySelect } from "../categories/CategorySelect";
import { Container } from "../../shared/ui/Container";
import { ListingCard } from "./ListingCard";
import { useTranslation } from "react-i18next";
import { useCities, useCountries } from "../hooks/useLocations";

export function ListingsPage() {
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] =
    useState<"newest" | "price_asc" | "price_desc">("newest");

  const [queryInput, setQueryInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [categoryIdInput, setCategoryIdInput] = useState<string | null>(null);
  const [countryInput, setCountryInput] = useState("MK");
  const [country, setCountry] = useState<string | undefined>("MK");

  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCities(countryInput || null);
  const { data: categories } = useCategories();

  const [query, setQuery] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const params: ListingsSearchV2Params = useMemo(
    () => ({
      query,
      city,
      minPrice,
      maxPrice,
      categoryId,
      sort,
      page,
      pageSize: 20,
      countryCode: country
    }),
    [query, city, minPrice, maxPrice, categoryId, sort, page, country]
  );

  const { data, isLoading, isError, error } =
    useListingsSearch(params);

  const items = data?.items ?? [];
  const totalPages = data
    ? Math.max(1, Math.ceil(data.totalCount / data.pageSize))
    : 1;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(queryInput.trim() || undefined);
    setCity(cityInput.trim() || undefined);
    setCountry(countryInput || undefined);
    setMinPrice(minPriceInput ? Number(minPriceInput) : undefined);
    setMaxPrice(maxPriceInput ? Number(maxPriceInput) : undefined);
    setCategoryId(categoryIdInput || undefined);
    setPage(1);
    setShowFilters(false);
  }

  function clearFilters() {
    setQueryInput("");
    setCityInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setCategoryIdInput(null);
    setCountryInput("MK");
    setQuery(undefined);
    setCity(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setCategoryId(undefined);
    setCountry("MK");
    setPage(1);
  }

  const hasFilters =
    !!categoryIdInput ||
    !!cityInput ||
    !!minPriceInput ||
    !!maxPriceInput;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)"
      }}
    >
      <Container>
        <div style={{ paddingTop: 40, paddingBottom: 60 }}>

          {/* Hero */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 50
            }}
          >
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 900,
                color: "var(--text-primary)",
                marginBottom: 20
              }}
            >
              {t("common.FindYourNextDeal")}
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: 600,
                margin: "0 auto"
              }}
            >
              {t("common.HeroSubtitle")}
            </p>
          </div>

          {/* Search Card */}
          <form
            onSubmit={onSubmit}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 24,
              boxShadow: "var(--shadow-sm)",
              marginBottom: 40
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                placeholder={t("common.SearchListings")}
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                style={inputStyle}
              />

              <button type="submit" style={primaryButton}>
                {t("common.Search")}
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(v => !v)}
                style={secondaryButton}
              >
                {t("common.Filters")} {hasFilters && "•"}
              </button>
            </div>

            {showFilters && (
              <div
                style={{
                  marginTop: 24,
                  padding: 20,
                  background: "var(--bg-light)",
                  borderRadius: 16,
                  border: "1px solid var(--border)"
                }}
              >
                {categories && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>
                      {t("common.Category")}
                    </label>
                    <CategorySelect
                      categories={categories}
                      value={categoryIdInput ?? ""}
                      onChange={v => setCategoryIdInput(v || null)}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  style={secondaryButton}
                >
                  {t("common.Clearfilters")}
                </button>
              </div>
            )}
          </form>

          {/* Results */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: 60 }}>
              {t("common.LoadingListings")}…
            </div>
          )}

          {isError && (
            <div
              style={{
                padding: 20,
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                borderRadius: 12,
                color: "var(--primary)"
              }}
            >
              {t("common.FailedToLoadListings")}
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {(error as Error)?.message}
              </div>
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                color: "var(--text-secondary)"
              }}
            >
              {t("common.NoResults")}
            </div>
          )}

          {items.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns:
                    view === "grid"
                      ? "repeat(auto-fill, minmax(280px, 1fr))"
                      : "1fr"
                }}
              >
                {items.map(item => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  marginTop: 40
                }}
              >
                <button
                  disabled={page <= 1}
                  onClick={() =>
                    setPage(p => Math.max(1, p - 1))
                  }
                  style={secondaryButton}
                >
                  ← {t("common.Prev")}
                </button>

                <span style={{ color: "var(--text-secondary)" }}>
                  {t("common.Page")} {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage(p =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  style={secondaryButton}
                >
                  {t("common.Next")} →
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

/* ------------------ SHARED STYLES ------------------ */

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 250,
  padding: "14px 18px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none"
};

const primaryButton: React.CSSProperties = {
  padding: "14px 24px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryButton: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  cursor: "pointer"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  marginBottom: 6,
  color: "var(--text-muted)"
};
