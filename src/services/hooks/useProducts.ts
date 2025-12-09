import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  productsService,
  type CreateProductDto,
  type UpdateProductDto,
  type Product,
  type FeaturedProductsResponse,
} from "../api/productsService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

export type ProductsPage = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};

export const useProducts = (params: {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.products.root],
    queryFn: () => productsService.findAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.products.byId(id),
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.products.byCategory(category),
    queryFn: () => productsService.findAll({ search: category }),
    enabled: !!category,
  });
};

export const useProductsPaginated = (
  page: number,
  limit: number,
  search?: string
) => {
  return useQuery<ProductsPage>({
    queryKey: [
      QUERY_KEYS.products.root,
      "paged",
      { page, limit, search: search || "" },
    ],
    queryFn: () => productsService.findAll({ page, limit, search }),
    placeholderData: (previousData) => previousData,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductDto) => productsService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.products.root] });
    },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateProductDto }) =>
      productsService.update(id, body),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.products.root] });
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.products.byId(variables.id),
      });
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.products.root] });
    },
  });
};

export const useFeaturedProducts = (perpage: number = 10) => {
  return useInfiniteQuery<FeaturedProductsResponse>({
    queryKey: [QUERY_KEYS.products.root, "featured"],
    queryFn: ({ pageParam = 1 }) =>
      productsService.getFeatured({ page: pageParam as number, perpage }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, perpage, total } = lastPage.pagination;
      const totalPages = Math.ceil(total / perpage);
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
