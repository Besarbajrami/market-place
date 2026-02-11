import { useQuery } from "@tanstack/react-query";
import { getSellerListings } from "./usersApi";

export function useSellerListings(
  sellerId: string,
  page: number,
  pageSize = 20,
  sort = "newest"
) {
  return useQuery({
    queryKey: ["seller-listings", sellerId, page, pageSize, sort],
    queryFn: () => getSellerListings(sellerId, page, pageSize, sort),
    staleTime: 30_000
  });
}
