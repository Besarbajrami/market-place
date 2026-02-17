import { http } from "../../../api/http";
import type { SearchPendingListingsResponse } from "./adminListingTypes";

export async function getPendingListings(page = 1, pageSize = 20) {
  const { data } = await http.get<SearchPendingListingsResponse>(
    "/api/admin/listings/pending",
    { params: { page, pageSize } }
  );

  return {
    ...data,
    items: data.items ?? [],
  };
}

export async function approveListing(id: string) {
  await http.post(`/api/admin/listings/${id}/approve`);
}

export async function rejectListing(id: string, reason: string) {
  await http.post(`/api/admin/listings/${id}/reject`, { reason });
}
