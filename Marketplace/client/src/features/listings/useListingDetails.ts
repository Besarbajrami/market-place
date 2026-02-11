import { useQuery } from "@tanstack/react-query";
import { getListingDetails } from "./listingsApi";

export function useListingDetails(id: string) {
  return useQuery({
    queryKey: ["listing-details", id],
    queryFn: () => getListingDetails(id),
    enabled: !!id
  });
}
