import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite, getMyFavorites } from "./favoritesApi";

export function useMyFavorites(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["my-favorites", page, pageSize],
    queryFn: () => getMyFavorites(page, pageSize),
    staleTime: 30_000
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (_, listingId) => {
      // ✅ Favorites page
      qc.invalidateQueries({ queryKey: ["my-favorites"] });

      // ✅ Listing details page
      qc.invalidateQueries({ queryKey: ["listing-details", listingId] });

      // ✅ Listings search / browse (partial keys to catch all variants)
      qc.invalidateQueries({ queryKey: ["listings-search"] });
      qc.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_, listingId) => {
      // ✅ Favorites page
      qc.invalidateQueries({ queryKey: ["my-favorites"] });

      // ✅ Listing details page
      qc.invalidateQueries({ queryKey: ["listing-details", listingId] });

      // ✅ Listings search / browse
      qc.invalidateQueries({ queryKey: ["listings-search"] });
      qc.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}
