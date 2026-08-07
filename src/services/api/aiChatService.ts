import { apiClient } from "./base";

export interface ChatSettings {
  id: string;
  systemPrompt: string;
  temperature: number;
  isEnabled: boolean;
  updatedAt: string;
  updatedBy: string | null;
}

export type UpdateChatSettingsDto = Partial<
  Pick<ChatSettings, "systemPrompt" | "temperature" | "isEnabled">
>;

export interface ProviderProfile {
  id: string;
  name: string;
  provider: string;
  baseUrl: string;
  apiKeyMasked: string;
  hasApiKey: boolean;
  model: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface UpsertProviderDto {
  name: string;
  provider?: string;
  baseUrl: string;
  apiKey?: string;
  model: string;
  priority?: number;
}

export interface TestConnectionResult {
  ok: boolean;
  message: string;
}

export interface AiChatErrorLog {
  id: string;
  sessionId: string | null;
  providerName: string | null;
  errorMessage: string;
  createdAt: string;
}

export interface PaginatedErrorLogsResponse {
  page: number;
  pageSize: number;
  total: number;
  logs: AiChatErrorLog[];
}

export const aiChatService = {
  getPublicStatus: () =>
    apiClient.get<{ isEnabled: boolean }>("/ai-chat/public-status"),

  getSettings: () => apiClient.get<ChatSettings>("/ai-chat/settings"),

  updateSettings: (body: UpdateChatSettingsDto) =>
    apiClient.put<ChatSettings>("/ai-chat/settings", body),

  getProviders: () => apiClient.get<ProviderProfile[]>("/ai-chat/providers"),

  createProvider: (body: UpsertProviderDto) =>
    apiClient.post<ProviderProfile>("/ai-chat/providers", body),

  updateProvider: (id: string, body: Partial<UpsertProviderDto>) =>
    apiClient.put<ProviderProfile>(`/ai-chat/providers/${id}`, body),

  deleteProvider: (id: string) =>
    apiClient.delete<void>(`/ai-chat/providers/${id}`),

  setProviderActive: (id: string, isActive: boolean) =>
    apiClient.put<ProviderProfile>(`/ai-chat/providers/${id}/active`, {
      isActive,
    }),

  testProvider: (id: string) =>
    apiClient.post<TestConnectionResult>(`/ai-chat/providers/${id}/test`),

  testDraft: (body: { baseUrl: string; apiKey?: string; model: string }) =>
    apiClient.post<TestConnectionResult>("/ai-chat/test", body),

  getErrorLogs: (params: { page?: number; pageSize?: number }) => {
    const sp = new URLSearchParams();
    if (params.page) sp.append("page", String(params.page));
    if (params.pageSize) sp.append("pageSize", String(params.pageSize));
    return apiClient.get<PaginatedErrorLogsResponse>(
      `/ai-chat/error-logs?${sp.toString()}`
    );
  },
};
