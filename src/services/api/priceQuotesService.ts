import { apiClient } from "./base";

export interface ContentSection {
  title: string;
  description: string;
  image?: string;
}

export interface PriceQuote {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections?: ContentSection[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceQuoteDto {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections?: ContentSection[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdatePriceQuoteDto extends Partial<CreatePriceQuoteDto> {}

export interface PriceQuotesResponse {
  data: PriceQuote[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const priceQuotesService = {
  getAll: async (params?: {
    page?: number;
    perPage?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.perPage)
      queryParams.append("perPage", params.perPage.toString());
    if (params?.search) queryParams.append("search", params.search);

    return apiClient.get<PriceQuotesResponse>(
      `/price-quotes?${queryParams.toString()}`
    );
  },

  getFeatured: async (limit?: number) => {
    const response = await apiClient.get<PriceQuote[]>(
      `/price-quotes/featured?limit=${limit || 5}`
    );
    return response;
  },

  getOne: async (id: string) => {
    return apiClient.get<PriceQuote>(`/price-quotes/${id}`);
  },

  create: async (data: CreatePriceQuoteDto) => {
    return apiClient.post<PriceQuote>("/price-quotes", data);
  },

  update: async (id: string, data: UpdatePriceQuoteDto) => {
    return apiClient.patch<PriceQuote>(`/price-quotes/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/price-quotes/${id}`);
  },
};
