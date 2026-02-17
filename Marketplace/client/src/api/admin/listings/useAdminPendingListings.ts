import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveListing, getPendingListings, rejectListing } from "./adminListingsApi";

export function useAdminPendingListings(page: number, pageSize: number) {
  return useQuery({
    queryKey: ["admin", "pendingListings", page, pageSize],
    queryFn: () => getPendingListings(page, pageSize),
  });
}

export function useApproveListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveListing(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "pendingListings"] });
    },
  });
}

export function useRejectListing() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectListing(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "pendingListings"] });
    },
  });
}
