import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
} from "./myListingsApi";
import { publishListing } from "./myListingsApi";
import { addListingImage, setListingCoverImage } from "./listingsApi";
import { uploadListingImages } from "./listingsApi";
import { createDraftListing } from "./myListingsApi";
import { http } from "../../api/http";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export type UploadedImage = {
  imageId: string;
  url: string;
  isCover: boolean;
};

/* ---------------------------------- */
/* Queries                            */
/* ---------------------------------- */

export function useMyListings() {
  return useQuery({
    queryKey: ["my-listings"],
    queryFn: getMyListings
  });
}

/* ---------------------------------- */
/* Mutations                          */
/* ---------------------------------- */

export function useAddListingImage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, url }: { listingId: string; url: string }) =>
      addListingImage(listingId, url),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["listing-details", variables.listingId] });
      qc.invalidateQueries({ queryKey: ["listing-edit", variables.listingId] });
    }
  });
}

export function useCreateDraftListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () =>
      http.post("/api/listings/draft").then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });
}

export function useSetListingCoverImage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ listingId, imageId }: { listingId: string; imageId: string }) =>
      setListingCoverImage(listingId, imageId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["listing-details", variables.listingId] });
      qc.invalidateQueries({ queryKey: ["listing-edit", variables.listingId] });
    }
  });
}

export function usePublishListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: publishListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-listings"] });
      qc.invalidateQueries({ queryKey: ["listings"] });
    }
  });
}

export function useUpdateListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: string;
      payload: {
        categoryId: string;
        title: string;
        description: string;
        price: number;
        currency: string;
        city: string;
        region: string;
        condition: string;
      countryCode: string;
        attributes: {
          categoryAttributeId: string;
          value: string;
        }[];
      };
    }) => updateListing(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-listings"] });
      qc.invalidateQueries({ queryKey: ["listing-edit"] });
    }
  });
}

/* ---------------------------------- */
/* ✅ FIXED UPLOAD HOOK                */
/* ---------------------------------- */

export function useUploadListingImages() {
  const qc = useQueryClient();

  return useMutation<
    UploadedImage[], // ✅ mutation return type
    unknown,
    { listingId: string; files: File[] }
  >({
    mutationFn: ({ listingId, files }) =>
      uploadListingImages(listingId, files), // MUST return data
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["listing-details", variables.listingId] });
      qc.invalidateQueries({ queryKey: ["listing-edit", variables.listingId] });
    }
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    }
  });
}
