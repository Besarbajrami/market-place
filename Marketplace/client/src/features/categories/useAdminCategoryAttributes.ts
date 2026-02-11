import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../api/http";

export function useAddCategoryAttributeOption() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      categoryId: string;
      attributeId: string;
      value: string;
    }) => {
      await http.post(`/api/admin/categories/attributes/${payload.attributeId}/options`, {
        value: payload.value
      });
    },
    onSuccess: (_, vars) => {
      // IMPORTANT: must match your query key in useCategoryAttributes
      qc.invalidateQueries({ queryKey: ["categoryAttributes", vars.categoryId] });
    }
  });
}
