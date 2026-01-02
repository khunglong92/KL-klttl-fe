import { apiClient } from "./base";

// CompanyIntro model interface based on Prisma schema
export interface CompanyIntro {
  id: string; // UUID
  url: string; // Image URL
  description?: string | null;
  subDescription?: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateCompanyIntroDto {
  url: string;
  description?: string;
  subDescription?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface UpdateCompanyIntroDto {
  url?: string;
  description?: string;
  subDescription?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export const companyIntroService = {
  // Public API - get active company intros for hero slider
  findAllActive: () => apiClient.get<CompanyIntro[]>("/company-intros"),

  // Admin APIs
  findAllAdmin: () => apiClient.get<CompanyIntro[]>("/company-intros/admin"),

  findOne: (id: string) => apiClient.get<CompanyIntro>(`/company-intros/${id}`),

  create: (body: CreateCompanyIntroDto) =>
    apiClient.post<CompanyIntro>("/company-intros", body),

  update: (id: string, body: UpdateCompanyIntroDto) =>
    apiClient.patch<CompanyIntro>(`/company-intros/${id}`, body),

  toggleActive: (id: string, isActive: boolean) =>
    apiClient.patch<CompanyIntro>(`/company-intros/${id}/active`, { isActive }),

  updateOrder: (id: string, orderIndex: number) =>
    apiClient.patch<CompanyIntro>(`/company-intros/${id}/order`, {
      orderIndex,
    }),

  softDelete: (id: string) => apiClient.delete<void>(`/company-intros/${id}`),
};
