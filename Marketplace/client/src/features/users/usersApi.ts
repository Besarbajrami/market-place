import { http } from "../../api/http";
import type { SellerListingsResponse } from "./sellerTypes";

export async function getSellerListings(
  sellerId: string,
  page = 1,
  pageSize = 20,
  sort = "newest"
) {
  const { data } = await http.get<SellerListingsResponse>(
    `/api/users/${sellerId}/listings`,
    { params: { page, pageSize, sort } }
  );

  return data;
}
