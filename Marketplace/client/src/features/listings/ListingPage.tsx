import { useMemo, useState } from "react";
import { useListingsSearch } from "./useListingsSearch";
import type { ListingsSearchV2Params } from "./listingTypes";
import { useCategories } from "../categories/useCategories";
import { CategoryTreeSelect } from "../categories/CategoryTreeSelect";
import { Container } from "../../shared/ui/Container";
import { Hero } from "../../shared/ui/Hero";
import { ListingCard } from "./ListingCard";
import { useTranslation } from "react-i18next";
import { CategorySelect } from "../categories/CategorySelect";
import { useCities, useCountries } from "../hooks/useLocations";

export function ListingsPage() {
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);

  // ✅ NEW (added, not replacing anything)
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] =
    useState<"newest" | "price_asc" | "price_desc">("newest");

  // input state (UNCHANGED)
  const [queryInput, setQueryInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [categoryIdInput, setCategoryIdInput] =
    useState<string | null>(null);
    const [countryInput, setCountryInput] = useState("MK");
    
    const [country, setCountry] = useState<string | undefined>("MK");
    
    const { data: countries = [] } = useCountries();
    const { data: cities = [] } = useCities(countryInput || null);
  // applied state (UNCHANGED)
  const [query, setQuery] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [categoryId, setCategoryId] =
    useState<string | undefined>();

  const [page, setPage] = useState(1);

  const { data: categories } = useCategories();

  // ✅ params extended safely (sort added, nothing removed)
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
    [
      query,
      city,
      minPrice,
      maxPrice,
      categoryId,
      sort,
      page,
      country
    ]
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
      setMinPrice(
        minPriceInput ? Number(minPriceInput) : undefined
      );
      setMaxPrice(
        maxPriceInput ? Number(maxPriceInput) : undefined
      );
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
    <Container>
      <div style={{ display: "grid", gap: 16 }}>
        <Hero
          title={t("common.FindYourNextDeal")}
          subtitle={t("common.HeroSubtitle")}
          backgroundImage="/images/hero-cars.jpg"
        />

        {/* SEARCH */}
        <form
  onSubmit={onSubmit}
  style={{
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 14,
    display: "grid",
    gap: 10
  }}
>
  {/* TOP ROW – SEARCH */}
  <div style={{ display: "flex", gap: 10 }}>
    <input
      placeholder={t("common.SearchListings")}
      value={queryInput}
      onChange={e => setQueryInput(e.target.value)}
      style={{
        flex: 1,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid var(--border)"
      }}
    />

    <button type="submit">
      {t("common.Search")}
    </button>

    <button
      type="button"
      onClick={() => setShowFilters(v => !v)}
    >
      {t("common.Filters")} {hasFilters && "•"}
    </button>
  </div>

  {/* SECOND ROW – VIEW + SORT (SUBTLE) */}
  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10
  }}
>

    {/* GRID / LIST */}
    <button
  type="button"
  onClick={() =>
    setView(v => (v === "list" ? "grid" : "list"))
  }
  style={{
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "white",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap"
  }}
>
  {view === "list" ? t("common.Grid") : t("common.List")}
</button>



    {/* SORT */}
    <select
  value={sort}
  onChange={e => setSort(e.target.value as any)}
  style={{
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    fontSize: 13,
    minWidth: 120
  }}
>
  <option value="newest">{t("common.Newest")}</option>
  <option value="price_asc">{t("common.Price")} ↑</option>
  <option value="price_desc">{t("common.Price")} ↓</option>
</select>

  </div>

  {/* FILTERS PANEL (UNCHANGED) */}
  {showFilters && (
    <div style={{ display: "grid", gap: 12 }}>
   {categories && (
  <div>
    <div
      style={{
        fontSize: 12,
        color: "var(--muted)",
        marginBottom: 6
      }}
    >
      {t("common.Category")}
    </div>

    <CategorySelect
  categories={categories}
  value={categoryIdInput ?? ""}
  onChange={value =>
    setCategoryIdInput(value || null)
  }
/>

  </div>
)}


      <div style={{ display: "flex", gap: 10 }}>
        <input
          placeholder={t("common.MinPrice")}
          value={minPriceInput}
          onChange={e =>
            setMinPriceInput(e.target.value)
          }
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10
          }}
        />
        <input
          placeholder={t("common.MaxPrice")}
          value={maxPriceInput}
          onChange={e =>
            setMaxPriceInput(e.target.value)
          }
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
  {/* COUNTRY FILTER */}
  <select
    value={countryInput}
    onChange={e => {
      setCountryInput(e.target.value);
      setCityInput(""); // reset city filter when country changes
    }}
    style={{
      flex: "0 0 140px",
      padding: 10,
      borderRadius: 10,
      border: "1px solid var(--border)",
      display:"none"
    }}
  >
    {countries.map(c => (
      <option key={c.code} value={c.code}>
        {c.name}
      </option>
    ))}
  </select>

  {/* CITY FILTER */}
  <select
    value={cityInput}
    onChange={e => setCityInput(e.target.value)}
    style={{
      flex: 1,
      minWidth: 140,
      padding: 10,
      borderRadius: 10,
      border: "1px solid var(--border)"
    }}
  >
    <option value="">{t("common.City") || "All cities"}</option>
    {cities.map(c => (
      <option key={c.id} value={c.name}>
        {c.name}
      </option>
    ))}
  </select>
</div>


      <button
        type="button"
        onClick={clearFilters}
        style={{
          justifySelf: "start",
          background: "transparent",
          border: "1px solid var(--border)",
          padding: "10px 12px",
          borderRadius: 10
        }}
      >
        {t("common.Clearfilters")}
      </button>
    </div>
  )}
</form>


        {/* RESULTS */}
        {isLoading && (
          <div>{t("common.LoadingListings")}…</div>
        )}

        {isError && (
          <div style={{ color: "crimson" }}>
            {t("common.FailedToLoadListings")}
            <div style={{ fontSize: 12 }}>
              {(error as Error)?.message}
            </div>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div style={{ color: "var(--muted)", padding: 16 }}>
            {t("common.NoResults")}
          </div>
        )}

        {items.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns:
                view === "grid"
                  ? "repeat(auto-fill, minmax(260px, 1fr))"
                  : "1fr"
              }}
            >
              {items.map(item => (
                <ListingCard
                  key={item.id}
                  listing={item}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12
              }}
            >
              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage(p => Math.max(1, p - 1))
                }
              >
                {t("common.Prev")}
              </button>

              <span>
                {t("common.Page")} {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage(p =>
                    Math.min(totalPages, p + 1)
                  )
                }
              >
                {t("common.Next")}
              </button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
