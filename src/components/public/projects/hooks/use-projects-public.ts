import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/base";

export interface Project {
  id: string;
  title: string;
  shortDescription?: string;
  detailedDescription?: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export function useProjectDetail(id?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["project-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<Project>(`/projects/${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    project: data,
    loading: isLoading,
    error,
  };
}
