import { useMemo } from "react";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { productsService } from "@/services/api/productsService";

const PRODUCTS_PER_PAGE = 8;

export const useRelatedProducts = (
  categoryId?: number,
  currentProductId?: number
) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["related-products", categoryId, currentProductId],
      queryFn: async ({ pageParam = 1 }) => {
        if (!categoryId) {
          // If no category, get featured products
          const response = await productsService.getFeatured({
            page: pageParam,
            perpage: PRODUCTS_PER_PAGE,
          });
          return {
            data: response.data,
            page: pageParam,
            limit: PRODUCTS_PER_PAGE,
            total: response.data.length, // Featured products might not have total
          };
        }
        // Get products from the same category
        const response = await productsService.findAll({
          categoryId,
          page: pageParam,
          limit: PRODUCTS_PER_PAGE,
        });
        return response;
      },
      getNextPageParam: (lastPage) => {
        const { page, limit, total } = lastPage;
        const totalPages = Math.ceil(total / limit);
        return page < totalPages ? page + 1 : undefined;
      },
      enabled: true,
      initialPageParam: 1,
      placeholderData: keepPreviousData,
    });

  // Flatten all pages and filter out current product
  const products = useMemo(() => {
    const allProducts = data?.pages?.flatMap((page) => page?.data ?? []) ?? [];
    return allProducts.filter((p) => p.id !== currentProductId);
  }, [data, currentProductId]);

  return {
    products,
    loading: isLoading,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
    isFetchingNextPage,
  };
};
