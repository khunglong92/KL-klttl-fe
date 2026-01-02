import {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from "@/components/admin/projects/types";
import { apiClient } from "./base";

export const projectsService = {
  deleteCategory: (id: string) =>
    apiClient.delete<void>(`/project-categories/${id}`),

  // Projects
  getProjects: (
    categoryId?: string,
    page?: number,
    perPage?: number,
    isFeatured?: boolean
  ) => {
    let url = "/projects";
    const params = new URLSearchParams();

    if (categoryId) params.append("categoryId", categoryId);
    if (page) params.append("page", page.toString());
    if (perPage) params.append("perpage", perPage.toString());
    if (isFeatured !== undefined)
      params.append("isFeatured", String(isFeatured));

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return apiClient.get<{ pagination: any; data: Project[] }>(url);
  },

  getProject: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  createProject: (data: CreateProjectDto) =>
    apiClient.post<Project>("/projects", data),

  updateProject: (id: string, data: UpdateProjectDto) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  deleteProject: (id: string) => apiClient.delete<void>(`/projects/${id}`),
};
