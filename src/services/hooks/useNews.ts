import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import {
  newsService,
  type News,
  PaginatedNewsResponse,
} from "../api/newsService";

export const useNews = (params: {
  page?: number;
  perpage?: number;
  search?: string;
}) => {
  const { page = 1, perpage = 10, search = "" } = params;
  return useQuery({
    queryKey: [QUERY_KEYS.news.root, { page, perpage, search }],
    queryFn: () => newsService.findAll({ page, perpage, search }),
    placeholderData: keepPreviousData,
  });
};

export const useNewsItem = (id?: string) => {
  return useQuery({
    queryKey: id ? QUERY_KEYS.news.byId(id) : [QUERY_KEYS.news.root],
    queryFn: () => newsService.findOne(id as string),
    enabled: !!id,
  });
};

export type { News };

export const useFeaturedNews = (perpage: number = 10) => {
  return useInfiniteQuery<PaginatedNewsResponse>({
    queryKey: QUERY_KEYS.news.featured,
    queryFn: ({ pageParam }) =>
      newsService.findFeatured({ page: pageParam as number, perpage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { page, perpage, total } = lastPage.pagination;
      const totalPages = Math.ceil(total / perpage);
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
