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
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Container>
        <div style={{ paddingTop: 40, paddingBottom: 60 }}>

          {/* HERO */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h1 style={heroTitle}>
              {t("common.FindYourNextDeal")}
            </h1>
            <p style={heroSubtitle}>
              {t("common.HeroSubtitle")}
            </p>
          </div>

          {/* SEARCH CARD */}
          <form onSubmit={onSubmit} style={cardStyle}>
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

            {/* VIEW + SORT */}
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setView(v => v === "list" ? "grid" : "list")}
                style={secondaryButton}
              >
                {view === "list"
                  ? "⊞ " + t("common.Grid")
                  : "☰ " + t("common.List")}
              </button>

              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                style={inputStyle}
              >
                <option value="newest">{t("common.Newest")}</option>
                <option value="price_asc">{t("common.Price")} ↑</option>
                <option value="price_desc">{t("common.Price")} ↓</option>
              </select>
            </div>

            {/* FILTER PANEL */}
            {showFilters && (
              <div style={filterPanel}>

                {/* CATEGORY */}
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

                {/* COUNTRY */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>
                    {t("common.Country")}
                  </label>
                  <select
                    value={countryInput}
                    onChange={e => setCountryInput(e.target.value)}
                    style={inputStyle}
                  >
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CITY */}
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>
                    {t("common.City")}
                  </label>
                  <select
                    value={cityInput}
                    onChange={e => setCityInput(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">
                      {t("common.AllCities")}
                    </option>
                    {cities.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRICE RANGE */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  <input
                    placeholder={t("common.MinPrice")}
                    value={minPriceInput}
                    onChange={e => setMinPriceInput(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder={t("common.MaxPrice")}
                    value={maxPriceInput}
                    onChange={e => setMaxPriceInput(e.target.value)}
                    style={inputStyle}
                  />
                </div>

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

          {/* RESULTS */}
          {isLoading && (
            <div style={{ textAlign: "center", padding: 60 }}>
              {t("common.LoadingListings")}…
            </div>
          )}

          {isError && (
            <div style={errorBox}>
              {t("common.FailedToLoadListings")}
              <div style={{ fontSize: 13 }}>
                {(error as Error)?.message}
              </div>
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div style={{ textAlign: "center", padding: 60 }}>
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

              <div style={paginationStyle}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={secondaryButton}
                >
                  ← {t("common.Prev")}
                </button>

                <span>
                  {t("common.Page")} {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage(p => Math.min(totalPages, p + 1))
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

/* ---------- SHARED STYLES ---------- */

const cardStyle: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 20,
  padding: 24,
  boxShadow: "var(--shadow-sm)",
  marginBottom: 40
};

const filterPanel: React.CSSProperties = {
  marginTop: 24,
  padding: 20,
  background: "var(--bg-light)",
  borderRadius: 16,
  border: "1px solid var(--border)"
};

const inputStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  fontSize: 14,
  outline: "none",
  minWidth: 150
};

const primaryButton: React.CSSProperties = {
  padding: "12px 24px",
  borderRadius: 12,
  border: "none",
  background: "var(--primary)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer"
};

const secondaryButton: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  cursor: "pointer"
};

const heroTitle: React.CSSProperties = {
  fontSize: "clamp(2.5rem, 6vw, 4rem)",
  fontWeight: 900,
  color: "var(--text-primary)",
  marginBottom: 16
};

const heroSubtitle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "var(--text-secondary)",
  maxWidth: 600,
  margin: "0 auto"
};

const paginationStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginTop: 40
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  marginBottom: 6,
  color: "var(--text-muted)"
};

const errorBox: React.CSSProperties = {
  padding: 20,
  background: "rgba(255,107,107,0.1)",
  border: "1px solid rgba(255,107,107,0.3)",
  borderRadius: 12,
  color: "var(--primary)"
};
