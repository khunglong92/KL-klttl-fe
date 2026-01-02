import { productsService } from "@/services/api/productsService";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";

const PRODUCTS_PER_PAGE = 12;

interface UseProductsByCategoryOptions {
  enabled?: boolean;
}

export function useProductsByCategory(
  categoryId?: number,
  options?: UseProductsByCategoryOptions
) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["products", { categoryId }],
      queryFn: ({ pageParam = 1 }) =>
        productsService.findAll({
          categoryId,
          page: pageParam,
          limit: PRODUCTS_PER_PAGE,
        }),
      getNextPageParam: (lastPage) => {
        const { page, limit, total } = lastPage;
        const totalPages = Math.ceil(total / limit);
        return page < totalPages ? page + 1 : undefined;
      },
      enabled:
        options?.enabled !== undefined
          ? options.enabled && !!categoryId
          : !!categoryId,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
    });

  const products = useMemo(
    () => data?.pages?.flatMap((page) => page?.data ?? []) ?? [],
    [data]
  );

  return {
    products,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}
