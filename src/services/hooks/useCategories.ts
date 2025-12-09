import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesService,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from "../api/categoriesService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.categories.root],
    queryFn: () => categoriesService.getAll(),
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCategoryDto) => categoriesService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.categories.root] });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCategoryDto }) =>
      categoriesService.update(id, body),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.categories.root] });
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.categories.byId(variables.id),
      });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.categories.root] });
    },
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.categories.byId(id),
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
};
