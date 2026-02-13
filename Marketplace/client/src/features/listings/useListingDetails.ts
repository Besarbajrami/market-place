import { useQuery } from "@tanstack/react-query";
import { getListingDetails } from "./listingsApi";

export function useListingDetails(id?: string | null) {
  return useQuery({
    queryKey: ["listing-details", id ?? null],
    queryFn: () => getListingDetails(id as string),
    enabled: typeof id === "string" && id.length > 0
  });
}