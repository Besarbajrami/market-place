import { useQuery } from "@tanstack/react-query";
import { getListingForEdit } from "./myListingsApi";

export function useListingForEdit(id: string) {
  return useQuery({
    queryKey: ["listing-edit", id],
    queryFn: () => getListingForEdit(id),
    enabled: !!id
  });
}
