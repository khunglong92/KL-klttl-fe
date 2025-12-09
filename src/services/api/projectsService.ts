import {
  CreateProjectCategoryDto,
  CreateProjectDto,
  Project,
  ProjectCategory,
  UpdateProjectCategoryDto,
  UpdateProjectDto,
} from "@/components/admin/projects/types";
import { apiClient } from "./base";

export const projectsService = {
  // Project Categories
  getCategories: () => apiClient.get<ProjectCategory[]>("/project-categories"),

  getCategory: (id: string) =>
    apiClient.get<ProjectCategory>(`/project-categories/${id}`),

  createCategory: (data: CreateProjectCategoryDto) =>
    apiClient.post<ProjectCategory>("/project-categories", data),

  updateCategory: (id: string, data: UpdateProjectCategoryDto) =>
    apiClient.patch<ProjectCategory>(`/project-categories/${id}`, data),

  deleteCategory: (id: string) =>
    apiClient.delete<void>(`/project-categories/${id}`),

  // Projects
  getProjects: (categoryId?: string, page?: number, perPage?: number) => {
    let url = "/projects";
    const params = new URLSearchParams();

    if (categoryId) params.append("categoryId", categoryId);
    if (page) params.append("page", page.toString());
    if (perPage) params.append("perpage", perPage.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return apiClient.get<{ pagination: any; data: Project[] }>(url);
  },

  getProject: (id: string) => apiClient.get<Project>(`/projects/${id}`),

  getFeaturedProjects: (page?: number, perPage?: number) => {
    let url = "/projects/featured";
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (perPage) params.append("perpage", perPage.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return apiClient.get<{ pagination: any; data: Project[] }>(url);
  },

  createProject: (data: CreateProjectDto) =>
    apiClient.post<Project>("/projects", data),

  updateProject: (id: string, data: UpdateProjectDto) =>
    apiClient.patch<Project>(`/projects/${id}`, data),

  deleteProject: (id: string) => apiClient.delete<void>(`/projects/${id}`),
};
