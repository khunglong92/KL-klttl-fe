import { apiClient } from "./base";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  dateOfBirth?: string;
  avtUrl?: string;
  createdAt: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const usersService = {
  findAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UsersResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.search) query.append("search", params.search);
    const url = `users${query.toString() ? `?${query.toString()}` : ""}`;
    return apiClient.get<UsersResponse>(url);
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get<User>("auth/profile");
  },

  update: async (
    id: number,
    data: {
      name?: string;
      role?: UserRole;
      dateOfBirth?: string;
      avtUrl?: string;
    }
  ): Promise<User> => {
    return apiClient.patch<User>(`users/${id}`, data);
  },

  remove: async (id: number): Promise<void> => {
    return apiClient.delete(`users/${id}`);
  },
};
