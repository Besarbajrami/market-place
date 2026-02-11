import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/http";
import type { CategoryNode } from "./categoryTypes";

export function useCategories() {
  return useQuery<CategoryNode[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await http.get<CategoryNode[]>("/api/categories");
      return res.data;
    }
  });
}
