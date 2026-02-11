import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryAdmin, type CreateCategoryPayload } from "./adminCategoriesApi";

export function useCreateCategoryAdmin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategoryAdmin(payload),
    onSuccess: () => {
      // reload tree
      qc.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}
