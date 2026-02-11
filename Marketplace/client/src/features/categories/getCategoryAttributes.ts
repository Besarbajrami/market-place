import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../api/http";
import { CategoryAttributeType } from "../categories/categoryTypes";

export interface CategoryAttributeOptionDto {
  id: string;
  value: string;
  sortOrder: number;
}
export function useCreateCategoryAttribute() {
    const qc = useQueryClient();
  
    return useMutation({
      mutationFn: async (payload: {
        categoryId: string;
        key: string;
        type: CategoryAttributeType;
        isRequired: boolean;
        sortOrder: number;
      }) => {
        await http.post("/api/admin/categories/attributes", payload);
      },
      onSuccess: (_, vars) => {
        qc.invalidateQueries({
          queryKey: ["category-attributes", vars.categoryId]
        });
      }
    });
  }
export interface CategoryAttributeDto {
    id: string;
    key: string;
    label: string;
    type: CategoryAttributeType;
    isRequired: boolean;
    options: {
      id: string;
      value: string;
      label: string;
    }[];
}

export async function getCategoryAttributes(categoryId: string) {
  const { data } = await http.get<CategoryAttributeDto[]>(
    `/api/categories/${categoryId}/attributes`
  );
  return data;
}
