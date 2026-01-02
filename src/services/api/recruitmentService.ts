import { apiClient } from "./base";

export interface RecruitmentContentSection {
  title: string;
  description: string;
  image?: string;
}

export interface Recruitment {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections?: RecruitmentContentSection[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecruitmentDto {
  id?: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections?: RecruitmentContentSection[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateRecruitmentDto extends Partial<CreateRecruitmentDto> {}

export interface RecruitmentListConfig {
  search?: string;
  page?: number;
  perPage?: number;
}

export interface RecruitmentListResponse {
  data: Recruitment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export const recruitmentService = {
  // Get all with pagination & search
  getAll: (config?: RecruitmentListConfig) => {
    const query = new URLSearchParams();
    if (config?.search) query.append("search", config.search);
    if (config?.page) query.append("page", String(config.page));
    if (config?.perPage) query.append("perPage", String(config.perPage));

    const url = `/recruitment${query.toString() ? `?${query.toString()}` : ""}`;
    return apiClient.get<RecruitmentListResponse>(url);
  },

  // Get featured
  getFeatured: (limit = 5) => {
    const query = new URLSearchParams();
    query.append("limit", String(limit));
    return apiClient.get<Recruitment[]>(
      `/recruitment/featured?${query.toString()}`
    );
  },

  // Get one by ID
  getById: (id: string) => {
    return apiClient.get<Recruitment>(`/recruitment/${id}`);
  },

  // Create
  create: (data: CreateRecruitmentDto) => {
    return apiClient.post<Recruitment>("/recruitment", data);
  },

  // Update
  update: (id: string, data: UpdateRecruitmentDto) => {
    return apiClient.patch<Recruitment>(`/recruitment/${id}`, data);
  },

  // Delete
  delete: (id: string) => {
    return apiClient.delete<void>(`/recruitment/${id}`);
  },
};
