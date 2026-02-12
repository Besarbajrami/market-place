import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSellerListings } from "./useSellerListings";
import { slugify } from "../../shared/slug";
import { Container } from "../../shared/ui/Container";
import { Card } from "../../shared/ui/Card";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ;

export function SellerPage() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const nav = useNavigate();
  const [page, setPage] = useState(1);

  if (!sellerId) return <div>Seller not found</div>;

  const { data, isLoading } = useSellerListings(sellerId, page);

  if (isLoading) return <div>Loading seller listings...</div>;
  if (!data || data.items.length === 0)
    return <div>No listings</div>;

  const totalPages = Math.max(
    1,
    Math.ceil(data.totalCount / data.pageSize)
  );

  return (
    <Container>
      <div style={{ display: "grid", gap: 16 }}>
        <h1 style={{ margin: 0 }}>Seller Listings</h1>

        {/* LIST */}
        <div style={{ display: "grid", gap: 12 }}>
          {data.items.map(x => {
            const imageUrl = x.coverImageUrl
              ? x.coverImageUrl.startsWith("http")
                ? x.coverImageUrl
                : `${API_BASE_URL}${x.coverImageUrl}`
              : "/images/placeholder.png";

            return (
              <Card
                key={x.id}
                onClick={() =>
                  nav(`/listings/${x.id}/${slugify(x.title)}`)
                }
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: 14,
                    alignItems: "center"
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      width: 80,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: "#f2f2f2",
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />

                  {/* INFO */}
                  <div>
                    <div style={{ fontWeight: 800 }}>
                      {x.title}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--muted)"
                      }}
                    >
                      {x.city}
                      {x.region && ` · ${x.region}`}
                      {x.categoryName && ` · ${x.categoryName}`}
                    </div>

                    <div
                      style={{
                        marginTop: 4,
                        fontWeight: 700
                      }}
                    >
                      {x.price} {x.currency}
                    </div>
                  </div>

                  {/* BADGES */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      alignItems: "flex-end"
                    }}
                  >
                    {x.isFeatured && (
                      <span
                        style={{
                          background: "#ffd700",
                          fontSize: 11,
                          fontWeight: 800,
                          padding: "4px 6px",
                          borderRadius: 6
                        }}
                      >
                        FEATURED
                      </span>
                    )}

                    {x.isUrgent && (
                      <span
                        style={{
                          background: "#e53935",
                          color: "white",
                          fontSize: 11,
                          fontWeight: 800,
                          padding: "4px 6px",
                          borderRadius: 6
                        }}
                      >
                        URGENT
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <span>
            Page {data.page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() =>
              setPage(p => Math.min(totalPages, p + 1))
            }
          >
            Next
          </button>
        </div>
      </div>
    </Container>
  );
}
