import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  recruitmentService,
  RecruitmentListConfig,
  CreateRecruitmentDto,
  UpdateRecruitmentDto,
} from "@/services/api/recruitmentService";

export const useRecruitmentList = (config?: RecruitmentListConfig) => {
  return useQuery({
    queryKey: ["recruitment", config],
    queryFn: () => recruitmentService.getAll(config),
  });
};

export const useFeaturedRecruitment = (limit?: number) => {
  return useQuery({
    queryKey: ["recruitment", "featured", limit],
    queryFn: () => recruitmentService.getFeatured(limit),
  });
};

export const useRecruitmentDetail = (id: string) => {
  return useQuery({
    queryKey: ["recruitment", id],
    queryFn: () => recruitmentService.getById(id),
    enabled: !!id,
  });
};

export const useRecruitmentMutations = () => {
  const queryClient = useQueryClient();

  const createRecruitment = useMutation({
    mutationFn: (data: CreateRecruitmentDto) => recruitmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] });
    },
  });

  const updateRecruitment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecruitmentDto }) =>
      recruitmentService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] });
      queryClient.invalidateQueries({
        queryKey: ["recruitment", variables.id],
      });
    },
  });

  const deleteRecruitment = useMutation({
    mutationFn: (id: string) => recruitmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] });
    },
  });

  return {
    createRecruitment,
    updateRecruitment,
    deleteRecruitment,
  };
};
