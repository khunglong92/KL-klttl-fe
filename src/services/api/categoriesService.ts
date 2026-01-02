import { apiClient } from "./base";

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string | null;
}

export const categoriesService = {
  create: (body: CreateCategoryDto) =>
    apiClient.post<Category>("/categories", body),
  getAll: () => apiClient.get<Category[]>("/categories"),
  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),
  update: (id: number, body: UpdateCategoryDto) =>
    apiClient.patch<Category>(`/categories/${id}`, body),
  remove: (id: number) => apiClient.delete<void>(`/categories/${id}`),
  reorder: (items: { id: number; orderIndex: number }[]) =>
    apiClient.patch<void>("/categories/reorder", items),
};
