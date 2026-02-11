import { http } from "../../api/http";
import type { CategoryNode } from "./categoryTypes";

export async function getCategories() {
  const { data } = await http.get<CategoryNode[]>("/api/categories");
  return data;
}
