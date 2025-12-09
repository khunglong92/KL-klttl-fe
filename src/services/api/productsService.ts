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

// Based on Prisma schema - description and technicalSpecs are Json type
export interface ProductDescription {
  overview?: string;
  details?: string;
  features?: string[];
  applications?: string[];
  materials?: string[];
}

export interface TechnicalSpecs {
  power?: string;
  origin?: string;
  voltage?: string;
  warranty?: string;
  material?: string;
  standard?: string;
  surface?: string;
  tolerance?: string;
  dimensions?: string;
  weight?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: ProductDescription | null; // Json type from Prisma
  technicalSpecs?: TechnicalSpecs | null; // Json type from Prisma (technical_specs)
  price?: string | null; // VarChar(255) from Prisma
  warrantyPolicy?: string | null; // VarChar(255) from Prisma (warranty_policy)
  images?: string[] | null; // String[] from Prisma
  categoryId?: number; // Int from Prisma (category_id)
  category?: ProductCategoryRef; // Relation from Prisma
  isFeatured?: boolean; // Boolean from Prisma (is_featured)
  createdAt?: string; // DateTime from Prisma (created_at)
  updatedAt?: string; // DateTime from Prisma (updated_at)
  deletedAt?: string | null; // DateTime? from Prisma (deleted_at)
}

export interface CreateProductDto {
  name: string;
  description?: ProductDescription;
  technicalSpecs?: TechnicalSpecs;
  price?: string;
  warrantyPolicy?: string;
  images?: string[];
  categoryId: number;
  isFeatured?: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: ProductDescription;
  technicalSpecs?: TechnicalSpecs;
  price?: string | null;
  warrantyPolicy?: string | null;
  images?: string[] | null;
  categoryId?: number;
  isFeatured?: boolean;
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
  getById: (id: number) => apiClient.get<Product>(`/products/${id}`),
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
  update: (id: number, body: UpdateProductDto) =>
    apiClient.patch<Product>(`/products/${id}`, body),
  remove: (id: number) => apiClient.delete<void>(`/products/${id}`),
};
