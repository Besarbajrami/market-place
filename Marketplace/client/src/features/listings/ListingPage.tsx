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
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const [queryInput, setQueryInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [categoryIdInput, setCategoryIdInput] = useState<string | null>(null);
  const [countryInput, setCountryInput] = useState("MK");
  const [country, setCountry] = useState<string | undefined>("MK");
  
  const { data: countries = [] } = useCountries();
  const { data: cities = [] } = useCities(countryInput || null);

  const [query, setQuery] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data: categories } = useCategories();

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

  const { data, isLoading, isError, error } = useListingsSearch(params);

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

  const hasFilters = !!categoryIdInput || !!cityInput || !!minPriceInput || !!maxPriceInput;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 0
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, rgba(255, 107, 107, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          animation: "float 20s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "15%",
          right: "-10%",
          width: "50%",
          height: "50%",
          background: "radial-gradient(circle, rgba(78, 205, 196, 0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          animation: "float 25s ease-in-out infinite reverse"
        }} />
      </div>

      <Container>
        <div style={{ 
          position: "relative", 
          zIndex: 1,
          paddingTop: 40,
          paddingBottom: 60
        }}>
          {/* Modern Hero Section */}
          <div style={{
            textAlign: "center",
            marginBottom: 50,
            animation: "fadeInUp 0.8s ease-out"
          }}>
            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 0%, #a8dadc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 20,
              letterSpacing: "-0.03em",
              lineHeight: 1.1
            }}>
              {t("common.FindYourNextDeal")}
            </h1>
            <p style={{
              fontSize: "1.25rem",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: 600,
              margin: "0 auto",
              fontWeight: 300,
              letterSpacing: "0.01em"
            }}>
              {t("common.HeroSubtitle")}
            </p>
          </div>

          {/* Glassmorphism Search Card */}
          <form
            onSubmit={onSubmit}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 24,
              padding: "28px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              marginBottom: 40,
              animation: "fadeInUp 0.8s ease-out 0.2s backwards"
            }}
          >
            {/* Search Row */}
            <div style={{ 
              display: "flex", 
              gap: 12,
              flexWrap: "wrap"
            }}>
              <input
                placeholder={t("common.SearchListings")}
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 280,
                  padding: "16px 20px",
                  borderRadius: 16,
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 500,
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(255, 107, 107, 0.5)";
                  e.target.style.background = "rgba(255, 255, 255, 0.12)";
                  e.target.style.boxShadow = "0 0 0 4px rgba(255, 107, 107, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                  e.target.style.background = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "inset 0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
              />

              <button 
                type="submit"
                style={{
                  padding: "16px 32px",
                  borderRadius: 16,
                  border: "none",
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 107, 107, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.4)";
                }}
              >
                {t("common.Search")}
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(v => !v)}
                style={{
                  padding: "16px 24px",
                  borderRadius: 16,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: hasFilters 
                    ? "rgba(78, 205, 196, 0.2)" 
                    : "rgba(255, 255, 255, 0.05)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  whiteSpace: "nowrap",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = hasFilters 
                    ? "rgba(78, 205, 196, 0.3)" 
                    : "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = hasFilters 
                    ? "rgba(78, 205, 196, 0.2)" 
                    : "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {t("common.Filters")} {hasFilters && "•"}
              </button>
            </div>

            {/* View & Sort Controls */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              gap: 12,
              flexWrap: "wrap"
            }}>
              <button
                type="button"
                onClick={() => setView(v => (v === "list" ? "grid" : "list"))}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                }}
              >
                {view === "list" ? "⊞ " + t("common.Grid") : "☰ " + t("common.List")}
              </button>

              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  minWidth: 140,
                  outline: "none"
                }}
              >
                <option value="newest">{t("common.Newest")}</option>
                <option value="price_asc">{t("common.Price")} ↑</option>
                <option value="price_desc">{t("common.Price")} ↓</option>
              </select>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div style={{ 
                marginTop: 24,
                padding: 24,
                background: "rgba(0, 0, 0, 0.2)",
                borderRadius: 16,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                animation: "slideDown 0.3s ease-out"
              }}>
                {categories && (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{
                      display: "block",
                      fontSize: 13,
                      color: "rgba(255, 255, 255, 0.6)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      {t("common.Category")}
                    </label>
                    <CategorySelect
                      categories={categories}
                      value={categoryIdInput ?? ""}
                      onChange={value => setCategoryIdInput(value || null)}
                    />
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: 13,
                      color: "rgba(255, 255, 255, 0.6)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      {t("common.MinPrice")}
                    </label>
                    <input
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={e => setMinPriceInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#fff",
                        fontSize: 14,
                        outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: 13,
                      color: "rgba(255, 255, 255, 0.6)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      {t("common.MaxPrice")}
                    </label>
                    <input
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={e => setMaxPriceInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "#fff",
                        fontSize: 14,
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: "block",
                    fontSize: 13,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: 8,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    {t("common.City")}
                  </label>
                  <select
                    value={cityInput}
                    onChange={e => setCityInput(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "#fff",
                      fontSize: 14,
                      outline: "none",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">{t("common.City") || "All cities"}</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: "transparent",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  }}
                >
                  {t("common.Clearfilters")}
                </button>
              </div>
            )}
          </form>

          {/* Results */}
          {isLoading && (
            <div style={{
              textAlign: "center",
              padding: 60,
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 16
            }}>
              <div style={{
                display: "inline-block",
                width: 40,
                height: 40,
                border: "3px solid rgba(255, 255, 255, 0.1)",
                borderTop: "3px solid #ff6b6b",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: 16
              }} />
              <div>{t("common.LoadingListings")}…</div>
            </div>
          )}

          {isError && (
            <div style={{
              padding: 24,
              background: "rgba(255, 107, 107, 0.1)",
              border: "1px solid rgba(255, 107, 107, 0.3)",
              borderRadius: 16,
              color: "#ff6b6b",
              textAlign: "center"
            }}>
              {t("common.FailedToLoadListings")}
              <div style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>
                {(error as Error)?.message}
              </div>
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: 60,
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: 16
            }}>
              {t("common.NoResults")}
            </div>
          )}

          {items.length > 0 && (
            <>
              <div
                style={{
                  display: "grid",
                  gap: 20,
                  gridTemplateColumns: view === "grid"
                    ? "repeat(auto-fill, minmax(280px, 1fr))"
                    : "1fr",
                  animation: "fadeIn 0.5s ease-out"
                }}
              >
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${i * 0.05}s backwards`
                    }}
                  >
                    <ListingCard listing={item} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                marginTop: 50,
                padding: 24,
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: page <= 1 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(255, 255, 255, 0.1)",
                    color: page <= 1 
                      ? "rgba(255, 255, 255, 0.3)" 
                      : "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (page > 1) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page > 1) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                >
                  ← {t("common.Prev")}
                </button>

                <span style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "0 16px"
                }}>
                  {t("common.Page")} {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    background: page >= totalPages 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(255, 255, 255, 0.1)",
                    color: page >= totalPages 
                      ? "rgba(255, 255, 255, 0.3)" 
                      : "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (page < totalPages) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (page < totalPages) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                >
                  {t("common.Next")} →
                </button>
              </div>
            </>
          )}
        </div>
      </Container>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 10px) scale(0.95); }
          75% { transform: translate(15px, 15px) scale(1.02); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }

        input::placeholder,
        select option {
          color: rgba(255, 255, 255, 0.4);
        }

        select option {
          background: #1a1a2e;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
