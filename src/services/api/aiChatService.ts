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
}

export interface TestConnectionResult {
  ok: boolean;
  message: string;
}

export type ChatRole = "USER" | "ASSISTANT";

export interface ChatLogMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatLogSession {
  sessionId: string;
  messageCount: number;
  lastMessageAt: string | null;
  messages: ChatLogMessage[];
}

export interface PaginatedChatLogsResponse {
  page: number;
  pageSize: number;
  totalSessions: number;
  sessions: ChatLogSession[];
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

  activateProvider: (id: string) =>
    apiClient.post<ProviderProfile>(`/ai-chat/providers/${id}/activate`),

  testProvider: (id: string) =>
    apiClient.post<TestConnectionResult>(`/ai-chat/providers/${id}/test`),

  testDraft: (body: { baseUrl: string; apiKey?: string; model: string }) =>
    apiClient.post<TestConnectionResult>("/ai-chat/test", body),

  getLogs: (params: { page?: number; pageSize?: number }) => {
    const sp = new URLSearchParams();
    if (params.page) sp.append("page", String(params.page));
    if (params.pageSize) sp.append("pageSize", String(params.pageSize));
    return apiClient.get<PaginatedChatLogsResponse>(
      `/ai-chat/logs?${sp.toString()}`
    );
  },
};
