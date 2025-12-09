import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import {
  servicesService,
  type CreateServiceDto,
  type UpdateServiceDto,
  type CompanyService,
  PaginatedServicesResponse,
} from "../api/servicesService";

export const useServices = (params: {
  page?: number;
  perpage?: number;
  search?: string;
}) => {
  const { page = 1, perpage = 10, search = "" } = params;
  return useQuery({
    queryKey: [QUERY_KEYS.services.root, { page, perpage, search }],
    queryFn: () => servicesService.findAll({ page, perpage, search }),
    placeholderData: keepPreviousData,
  });
};

export const useService = (id?: string) => {
  return useQuery({
    queryKey: id ? QUERY_KEYS.services.byId(id) : [QUERY_KEYS.services.root],
    queryFn: () => servicesService.findOne(id as string),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateServiceDto) => servicesService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.services.root] });
    },
  });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateServiceDto }) =>
      servicesService.update(id, body),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.services.root] });
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.services.byId(variables.id),
      });
    },
  });
};

export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.services.root] });
    },
  });
};

export type { CompanyService };

export const useFeaturedServices = (perpage: number = 10) => {
  return useInfiniteQuery<PaginatedServicesResponse>({
    queryKey: [QUERY_KEYS.services.root, "featured"],
    queryFn: ({ pageParam }) =>
      servicesService.findFeatured({ page: pageParam as number, perpage }),
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
