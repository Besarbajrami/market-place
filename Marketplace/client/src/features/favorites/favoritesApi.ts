import { http } from "../../api/http";

/* ---------------------------------- */
/* Mutations                           */
/* ---------------------------------- */

export async function addFavorite(listingId: string) {
  await http.post(`/api/favorites/${listingId}`);
}

export async function removeFavorite(listingId: string) {
  await http.delete(`/api/favorites/${listingId}`);
}

/* ---------------------------------- */
/* Types                               */
/* ---------------------------------- */

export type FavoriteItem = {
  listingId: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  region: string;
  publishedAt: string;
  coverImageUrl?: string | null;
  isFeatured: boolean;
  isUrgent: boolean;
  categoryName: string;
  categorySlug: string;
  favoritedAt: string;
};

export type MyFavoritesResponse = {
  page: number;
  pageSize: number;
  totalCount: number; // ✅ FIXED
  items: FavoriteItem[];
};

/* ---------------------------------- */
/* Query                               */
/* ---------------------------------- */

export async function getMyFavorites(
  page: number,
  pageSize: number
) {
  const { data } = await http.get<MyFavoritesResponse>(
    "/api/favorites",
    { params: { page, pageSize } }
  );

  // ✅ defensive guard (same pattern as elsewhere)
  return {
    ...data,
    items: data.items ?? []
  };
}
