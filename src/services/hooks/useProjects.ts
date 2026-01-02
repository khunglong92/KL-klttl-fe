import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { projectsService } from "../api/projectsService";

export const useProjects = (
  categoryId?: string,
  page?: number,
  perPage?: number,
  isFeatured?: boolean
) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.projects.root,
      { categoryId, page, perPage, isFeatured },
    ],
    queryFn: () =>
      projectsService.getProjects(categoryId, page, perPage, isFeatured),
    placeholderData: keepPreviousData,
  });
};
