import { useQuery } from "@tanstack/react-query";
import { searchListingsV2 } from "./listingsApi";
import type {
  ListingsSearchV2Params,
  PagedResponse,
  ListingSearchItem
} from "./listingTypes";
import { useTranslation } from "react-i18next";

export function useListingsSearch(params: ListingsSearchV2Params) {
    const { i18n } = useTranslation();
  return useQuery<PagedResponse<ListingSearchItem>, Error>({
    queryKey: ["listings", "search-v2", i18n.language,params],
    queryFn: () => searchListingsV2(params),
    staleTime: 30_000,

    // ✅ React Query v5 replacement for keepPreviousData
    placeholderData: prev => prev
  });
}
