import { http } from "../../api/http";
import type { MyListingItem, MyListingsResponse } from "./myListingTypes";

export async function getMyListings() {
  const { data } = await http.get<MyListingsResponse>("/api/me/listings");
  return data;
}

export async function createListing(payload: {
    categoryId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    city: string;
    region: string;
    condition: string;
  }) {
    const { data } = await http.post("/api/listings", payload);
    return data;
  }
  
  export type ListingEditDto = {
    id: string;
    categoryId: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    city: string;
    locationCountryCode: string;
    region: string;
    condition: string;
    status: number;
  
    attributes: {
      categoryAttributeId: string;
      value: string;
    }[];
  };
  
  
  
  export async function getListingForEdit(id: string) {
    const { data } = await http.get<ListingEditDto>(`/api/listings/${id}/edit`);

    return data;
  }
  export async function createDraftListing() {
    const res = await http.post("/api/listings/draft");
    return res.data;
  }
  
  export async function updateListing(
    id: string,
    payload: {
      categoryId: string;
      title: string;
      description: string;
      price: number;
      currency: string;
      city: string;
      region: string;
      condition: string;
    }
  ) {
    await http.put(`/api/listings/${id}`, payload);
  }
  
  export async function publishListing(id: string) {
    await http.post(`/api/listings/${id}/publish`);
  }
  
export async function deleteListing(id: string) {
  await http.delete(`/api/listings/${id}`);
}
