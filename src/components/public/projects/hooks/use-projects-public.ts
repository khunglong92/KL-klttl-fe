import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/base";

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  content?: string;
  location?: string;
  completionDate?: string;
  image?: string;
  gallery?: any;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ProjectCategory;
}

export interface ProjectsResponse {
  data: Project[];
  total?: number;
  page?: number;
  limit?: number;
}

export function useProjectsPublic() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects-public"],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsResponse>("/projects");
      // Filter only active projects
      const activeProjects =
        response?.data?.filter((project) => project.isActive) || [];
      return activeProjects;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    projects: data || [],
    loading: isLoading,
    error,
  };
}

export function useFeaturedProjects() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects-featured"],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsResponse>("/projects");
      // Filter featured and active projects
      const featuredProjects =
        response?.data?.filter(
          (project) => project.isFeatured && project.isActive
        ) || [];
      return featuredProjects;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: data || [],
    loading: isLoading,
    error,
  };
}

export function useProjectsByCategory(categoryId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects-by-category", categoryId],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsResponse>("/projects");
      // Filter by category and active status
      const filtered =
        response?.data?.filter(
          (project) =>
            project.isActive &&
            (!categoryId || project.categoryId === categoryId)
        ) || [];
      return filtered;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    projects: data || [],
    loading: isLoading,
    error,
  };
}

export function useProjectDetail(slug?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["project-detail", slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await apiClient.get<ProjectsResponse>("/projects");
      const project = response?.data?.find(
        (p) => p.slug === slug && p.isActive
      );
      return project || null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return {
    project: data,
    loading: isLoading,
    error,
  };
}

export function useProjectCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["project-categories"],
    queryFn: async () => {
      const response = await apiClient.get<ProjectCategory[]>(
        "/project-categories"
      );
      // Filter only active categories
      const activeCategories =
        response?.filter((category) => category.isActive) || [];
      return activeCategories;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    categories: data || [],
    loading: isLoading,
    error,
  };
}
