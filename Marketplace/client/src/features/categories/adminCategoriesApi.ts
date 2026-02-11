import { http } from "../../api/http";

export type CreateCategoryPayload = {
  parentId: string | null;
  code: string;
  name: string;
  slug: string;
};

export async function createCategoryAdmin(payload: CreateCategoryPayload) {
  const res = await http.post<string>("/api/admin/categories", {
    parentId: payload.parentId,
    code: payload.code,
    name: payload.name,
    slug: payload.slug
  });

  return res.data; // categoryId (Guid as string)
}
