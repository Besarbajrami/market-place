import { useQuery } from "@tanstack/react-query";
import { type CategoryAttributeDto, getCategoryAttributes } from "../getCategoryAttributes";

export function useCategoryAttributes(categoryId: string | null | undefined) {
  return useQuery<CategoryAttributeDto[]>({
    queryKey: ["categoryAttributes", categoryId],
    queryFn: () => {
      if (!categoryId) throw new Error("categoryId is required");
      return getCategoryAttributes(categoryId);
    },
    enabled: !!categoryId,
  });
}
