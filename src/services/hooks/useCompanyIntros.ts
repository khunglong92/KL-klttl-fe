import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  companyIntroService,
  type CompanyIntro,
  type CreateCompanyIntroDto,
  type UpdateCompanyIntroDto,
} from "../api/companyIntroService";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

// Hook to get active company intros for hero slider (public)
export const useCompanyIntros = () => {
  return useQuery<CompanyIntro[]>({
    queryKey: QUERY_KEYS.companyIntros.active,
    queryFn: () => companyIntroService.findAllActive(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get all company intros for admin
export const useCompanyIntrosAdmin = () => {
  return useQuery<CompanyIntro[]>({
    queryKey: QUERY_KEYS.companyIntros.admin,
    queryFn: () => companyIntroService.findAllAdmin(),
  });
};

// Hook to get single company intro
export const useCompanyIntro = (id: string) => {
  return useQuery<CompanyIntro>({
    queryKey: QUERY_KEYS.companyIntros.byId(id),
    queryFn: () => companyIntroService.findOne(id),
    enabled: !!id,
  });
};

// Hook to create company intro
export const useCreateCompanyIntro = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCompanyIntroDto) =>
      companyIntroService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.companyIntros.root] });
    },
  });
};

// Hook to update company intro
export const useUpdateCompanyIntro = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCompanyIntroDto }) =>
      companyIntroService.update(id, body),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.companyIntros.root] });
      qc.invalidateQueries({
        queryKey: QUERY_KEYS.companyIntros.byId(variables.id),
      });
    },
  });
};

// Hook to toggle active status
export const useToggleCompanyIntroActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      companyIntroService.toggleActive(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.companyIntros.root] });
    },
  });
};

// Hook to delete company intro
export const useDeleteCompanyIntro = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companyIntroService.softDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.companyIntros.root] });
    },
  });
};
