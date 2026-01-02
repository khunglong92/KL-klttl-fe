import { apiClient } from "./base";

export interface News {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  content?: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface PaginatedNewsResponse {
  data: News[];
  pagination: {
    total: number;
    page: number;
    perpage: number;
  };
}

export const newsService = {
  findAll: (params: { page?: number; perpage?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", String(params.page));
    if (params.perpage) searchParams.append("perpage", String(params.perpage));
    if (params.search) searchParams.append("search", params.search);
    return apiClient.get<PaginatedNewsResponse>(
      `/news?${searchParams.toString()}`
    );
  },

  findFeatured: (params: { page?: number; perpage?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", String(params.page));
    if (params.perpage) searchParams.append("perpage", String(params.perpage));
    return apiClient.get<PaginatedNewsResponse>(
      `/news?${searchParams.toString()}`
    );
  },

  findOne: (id: string) => apiClient.get<News>(`/news/${id}`),
};
