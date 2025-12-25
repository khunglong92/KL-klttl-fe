import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { projectsService } from "../api/projectsService";

export const useProjects = (
  categoryId?: string,
  page?: number,
  perPage?: number
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.projects.root, { categoryId, page, perPage }],
    queryFn: () => projectsService.getProjects(categoryId, page, perPage),
    placeholderData: keepPreviousData,
  });
};

export const useFeaturedProjects = (page: number = 1, perPage: number = 5) => {
  return useQuery({
    queryKey: QUERY_KEYS.projects.featured,
    queryFn: () => projectsService.getFeaturedProjects(page, perPage),
    placeholderData: keepPreviousData,
  });
};
