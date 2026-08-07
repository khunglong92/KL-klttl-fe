import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import {
  aiChatService,
  type UpdateChatSettingsDto,
  type UpsertProviderDto,
} from "../api/aiChatService";

export const usePublicChatStatus = () =>
  useQuery({
    queryKey: QUERY_KEYS.aiChat.publicStatus,
    queryFn: aiChatService.getPublicStatus,
    staleTime: 5 * 60 * 1000,
  });

export const useAiSettings = () =>
  useQuery({
    queryKey: QUERY_KEYS.aiChat.settings,
    queryFn: aiChatService.getSettings,
  });

export const useUpdateAiSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateChatSettingsDto) =>
      aiChatService.updateSettings(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.aiChat.settings });
    },
  });
};

export const useAiProviders = () =>
  useQuery({
    queryKey: [QUERY_KEYS.aiChat.providers.root],
    queryFn: aiChatService.getProviders,
  });

export const useCreateAiProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertProviderDto) => aiChatService.createProvider(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.aiChat.providers.root] });
    },
  });
};

export const useUpdateAiProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<UpsertProviderDto>;
    }) => aiChatService.updateProvider(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.aiChat.providers.root] });
    },
  });
};

export const useDeleteAiProvider = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiChatService.deleteProvider(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.aiChat.providers.root] });
    },
  });
};

export const useSetAiProviderActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      aiChatService.setProviderActive(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.aiChat.providers.root] });
    },
  });
};

export const useTestAiProvider = () =>
  useMutation({
    mutationFn: (id: string) => aiChatService.testProvider(id),
  });

export const useTestDraftAiProvider = () =>
  useMutation({
    mutationFn: (body: { baseUrl: string; apiKey?: string; model: string }) =>
      aiChatService.testDraft(body),
  });

export const useAiChatErrorLogs = (params: {
  page?: number;
  pageSize?: number;
}) => {
  const { page = 1, pageSize = 20 } = params;
  return useQuery({
    queryKey: QUERY_KEYS.aiChat.errorLogs.paginated(page, pageSize),
    queryFn: () => aiChatService.getErrorLogs({ page, pageSize }),
    placeholderData: keepPreviousData,
  });
};
