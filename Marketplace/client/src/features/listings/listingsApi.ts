// src/features/listings/listingsApi.ts
import { http } from "../../api/http";
import type {
  ListingsSearchParams,
  ListingSearchItem,
  PagedResponse,
  ListingsSearchV2Params
} from "./listingTypes";
import type { ListingImage } from "./listingTypes";

/* ---------------------------------- */
/* Search endpoints                   */
/* ---------------------------------- */

export async function searchListings(params: ListingsSearchParams) {
  const { data } = await http.get<PagedResponse<ListingSearchItem>>(
    "/api/listings",
    {
      params
    }
  );
  return data;
}

/* ---------------------------------- */
/* Types for listing details          */
/* ---------------------------------- */

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
};

// 👇 NEW: seller summary coming from backend
export type SellerSummaryDto = {
  id: string;
  displayName: string;
};

export type ListingDetailsDto = {
  id: string;

  // seller identity
  sellerId: string;
  seller: SellerSummaryDto; // 👈 NEW FIELD

  // basics
  title: string;
  description: string;

  price: number;
  currency: string;
  condition: string;

  city: string;
  region: string;

  status: number;
  publishedAt?: string;

  // flags
  isFeatured: boolean;
  isUrgent: boolean;

  viewCount: number;

  // relations
  category: CategoryDto;
  images: ListingImage[];

  isFavorite: boolean;
};

/* ---------------------------------- */
/* Listing details                    */
/* ---------------------------------- */

export async function getListingDetails(id: string) {
  const { data } = await http.get<ListingDetailsDto>(`/api/listings/${id}`);
  return data;
}

/* ---------------------------------- */
/* Images (add, cover, upload)        */
/* ---------------------------------- */

export async function addListingImage(listingId: string, url: string) {
  await http.post(`/api/listings/${listingId}/images`, { url });
}

export async function setListingCoverImage(
  listingId: string,
  imageId: string
) {
  await http.post(`/api/listings/${listingId}/images/cover`, { imageId });
}

export type UploadedImageDto = {
  imageId: string;
  url: string;
  isCover: boolean;
};

export async function searchListingsV2(
  params: ListingsSearchV2Params
): Promise<PagedResponse<ListingSearchItem>> {
  const { data } = await http.get<PagedResponse<ListingSearchItem>>(
    "/api/listings/search-v2",
    { params }
  );
debugger;
  // ✅ hard guard: never allow items to be undefined
  return {
    ...data,
    items: data.items ?? []
  };
}

export async function uploadListingImages(
  listingId: string,
  files: File[]
): Promise<UploadedImageDto[]> {
  const form = new FormData();

  for (const file of files) {
    form.append("files", file);
  }

  const res = await http.post<UploadedImageDto[]>(
    `/api/listings/${listingId}/images/upload`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return res.data;
}
