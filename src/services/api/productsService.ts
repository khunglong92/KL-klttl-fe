import { apiClient } from "./base";

export interface ProductCategoryRef {
  id: number;
  name: string;
  description?: string | null;
  updatedByUserId?: number | null;
  updatedByName?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Product {
  id: string;
  name: string;
  price?: string | null;
  images?: string[] | null;
  description?: string[] | null;
  detailedDescription?: string | null;
  categoryId?: number;
  category?: ProductCategoryRef;
  showPrice?: boolean;
  isFeatured?: boolean;
  likes?: number;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateProductDto {
  name: string;
  price?: string;
  images?: string[];
  description?: string[];
  detailedDescription?: string;
  categoryId: number;
  showPrice?: boolean;
  isFeatured?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  price?: string | null;
  images?: string[] | null;
  description?: string[];
  detailedDescription?: string;
  categoryId?: number;
  showPrice?: boolean;
  isFeatured?: boolean;
  deletedImages?: string[];
}

export interface FeaturedProductsResponse {
  pagination: {
    total: number;
    page: number;
    perpage: number;
  };
  data: Product[];
}

export const productsService = {
  findAll: (params: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.categoryId) query.set("categoryId", String(params.categoryId));
    if (params.search && params.search.trim()) {
      query.set("search", params.search.trim());
    }
    return apiClient.get<{
      data: Product[];
      total: number;
      page: number;
      limit: number;
    }>(`/products?${query.toString()}`);
  },
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  getFeatured: (params: { page: number; perpage: number }) => {
    const query = new URLSearchParams();
    query.set("page", String(params.page));
    query.set("perpage", String(params.perpage));
    return apiClient.get<FeaturedProductsResponse>(
      `/products/featured?${query.toString()}`
    );
  },
  create: (body: CreateProductDto) =>
    apiClient.post<Product>("/products", body),
  update: (id: string, body: UpdateProductDto) =>
    apiClient.patch<Product>(`/products/${id}`, body),
  remove: (id: string) => apiClient.delete<void>(`/products/${id}`),
  reorder: (items: { id: string; orderIndex: number }[]) =>
    apiClient.patch<void>("/products/reorder", items),
};
