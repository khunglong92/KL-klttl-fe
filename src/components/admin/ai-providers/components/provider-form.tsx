import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Select,
  Stack,
  Group,
  Alert,
  NumberInput,
  Button,
} from "@mantine/core";
import AppButton from "@/components/atoms/app-button";
import type {
  ProviderProfile,
  UpsertProviderDto,
} from "@/services/api/aiChatService";

const PRESETS = [
  { label: "OpenAI", provider: "openai", baseUrl: "https://api.openai.com/v1" },
  {
    label: "Google Gemini",
    provider: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
  },
  {
    label: "NVIDIA NIM",
    provider: "nvidia",
    baseUrl: "https://integrate.api.nvidia.com/v1",
  },
  {
    label: "OpenRouter",
    provider: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
  },
  { label: "Groq", provider: "groq", baseUrl: "https://api.groq.com/openai/v1" },
  { label: "Tuỳ chỉnh (Custom)", provider: "custom", baseUrl: "" },
];

interface ProviderFormProps {
  initial: ProviderProfile | null;
  isSaving: boolean;
  onSubmit: (data: UpsertProviderDto) => Promise<void>;
  onCancel: () => void;
  onTestDraft: (draft: {
    baseUrl: string;
    apiKey?: string;
    model: string;
  }) => Promise<{ ok: boolean; message: string }>;
}

export function ProviderForm({
  initial,
  isSaving,
  onSubmit,
  onCancel,
  onTestDraft,
}: ProviderFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [provider, setProvider] = useState(initial?.provider ?? "custom");
  const [baseUrl, setBaseUrl] = useState(initial?.baseUrl ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [apiKey, setApiKey] = useState(initial?.apiKeyMasked ?? "");
  const [priority, setPriority] = useState<number>(initial?.priority ?? 0);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const isMaskedUnchanged = !!initial && apiKey === initial.apiKeyMasked;

  const handleApiKeyFocus = () => {
    if (isMaskedUnchanged) setApiKey("");
  };

  const handlePresetChange = (value: string | null) => {
    const preset = PRESETS.find((p) => p.provider === value);
    if (preset) {
      setProvider(preset.provider);
      if (preset.baseUrl) setBaseUrl(preset.baseUrl);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await onTestDraft({
        baseUrl,
        apiKey: isMaskedUnchanged ? undefined : apiKey || undefined,
        model,
      });
      setTestResult(result);
    } catch (e) {
      setTestResult({
        ok: false,
        message: e instanceof Error ? e.message : "Có lỗi xảy ra",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      provider,
      baseUrl,
      model,
      priority,
      apiKey: isMaskedUnchanged ? undefined : apiKey || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Tên gợi nhớ"
          placeholder="VD: OpenAI chính"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <Select
          label="Nhà cung cấp"
          data={PRESETS.map((p) => ({ value: p.provider, label: p.label }))}
          value={provider}
          onChange={handlePresetChange}
        />
        <TextInput
          label="Base URL"
          placeholder="https://api.openai.com/v1"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Model"
          placeholder="gpt-4o-mini"
          value={model}
          onChange={(e) => setModel(e.currentTarget.value)}
          required
        />
        <PasswordInput
          label="API Key"
          placeholder="sk-..."
          value={apiKey}
          onFocus={handleApiKeyFocus}
          onChange={(e) => setApiKey(e.currentTarget.value)}
        />
        <NumberInput
          label="Thứ tự fallback"
          description="0 = thử trước tiên. Nếu bật nhiều provider, hệ thống tự chuyển sang provider có số lớn hơn kế tiếp khi provider hiện tại lỗi."
          min={0}
          value={priority}
          onChange={(v) => setPriority(typeof v === "number" ? v : 0)}
        />

        {testResult && (
          <Alert color={testResult.ok ? "green" : "red"}>
            {testResult.message}
          </Alert>
        )}

        <Group justify="space-between" mt="md">
          <Button type="button" variant="default" loading={isTesting} onClick={handleTest}>
            Thử kết nối
          </Button>
          <Group>
            <Button type="button" variant="default" onClick={onCancel}>
              Huỷ
            </Button>
            <AppButton
              label={initial ? "Lưu thay đổi" : "Tạo cấu hình"}
              htmlType="submit"
              showArrow={false}
              loading={isSaving}
            />
          </Group>
        </Group>
      </Stack>
    </form>
  );
}
