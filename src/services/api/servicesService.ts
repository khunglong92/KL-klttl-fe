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
  name: string;
  shortDescription: string;

  detailedDescription?: string;
  images: string[];
  isFeatured: boolean;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  hashtags: string[];
  deletedAt?: string;
  orderIndex?: number;

  // Computed / Relations
  averageRating: number;
  reviewCount: number;
  reviews?: any[]; // Allow generic or define Review type if needed
}

export type CreateServiceDto = {
  id?: string;
  name: string;
  shortDescription: string;
  detailedDescription?: string;
  hashtags?: string[];
  images?: string[];
  isFeatured?: boolean;
};

export interface UpdateServiceDto extends Partial<CreateServiceDto> {
  deletedImages?: string[];
}

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

  reorder: (items: { id: string; orderIndex: number }[]) =>
    apiClient.patch<void>("/services/reorder", items),
};
