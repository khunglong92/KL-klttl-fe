import { apiClient } from "./base";

export enum ServiceStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum ThemeVariant {
  LIGHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

export interface CompanyService {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  content: string[] | string;
  features: string[] | string;
  technologies: string[] | string;
  benefits: string[] | string;
  customers: string;
  imageUrls: string[];
  imageAlts?: string[];
  icon: string;
  ctaLabel: string;
  ctaLink: string;
  orderIndex: number;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  altText: string;
  status: ServiceStatus;
  themeVariant: ThemeVariant;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateServiceDto = Omit<
  CompanyService,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

export type UpdateServiceDto = Partial<CreateServiceDto>;

export interface PaginatedServicesResponse {
  data: CompanyService[];
  pagination: {
    total: number;
    page: number;
    perpage: number;
  };
}

export const servicesService = {
  create: (body: CreateServiceDto) =>
    apiClient.post<CompanyService>("/services", body),

  findAll: (params: { page?: number; perpage?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", String(params.page));
    if (params.perpage) searchParams.append("perpage", String(params.perpage));
    if (params.search) searchParams.append("search", params.search);
    return apiClient.get<PaginatedServicesResponse>(
      `/services?${searchParams.toString()}`
    );
  },

  findFeatured: (params: { page?: number; perpage?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", String(params.page));
    if (params.perpage) searchParams.append("perpage", String(params.perpage));
    return apiClient.get<PaginatedServicesResponse>(
      `/services/featured?${searchParams.toString()}`
    );
  },

  findOne: (id: string) => apiClient.get<CompanyService>(`/services/${id}`),

  update: (id: string, body: UpdateServiceDto) =>
    apiClient.patch<CompanyService>(`/services/${id}`, body),

  remove: (id: string) => apiClient.delete<void>(`/services/${id}`),
};
