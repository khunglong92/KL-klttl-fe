import { Card, Stack, Skeleton, Group, Text } from "@mantine/core";
import { Plus } from "lucide-react";
import AppButton from "@/components/atoms/app-button";
import { useAiProviderCrud } from "./hooks/use-ai-provider-crud";
import { ProviderCard } from "./components/provider-card";
import { ProviderForm } from "./components/provider-form";

export default function AiProvidersManager() {
  const {
    providers,
    isFetching,
    mode,
    editingProvider,
    testResults,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    toggleActive,
    testSaved,
    testDraft,
    isSaving,
  } = useAiProviderCrud();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý API Keys</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cấu hình các nhà cung cấp AI (OpenAI, Gemini, NVIDIA, OpenRouter, Groq, tuỳ chỉnh).
            Có thể bật nhiều provider cùng lúc — hệ thống tự chuyển sang provider kế tiếp
            (theo thứ tự fallback) nếu provider đang dùng bị lỗi.
          </p>
        </div>
        {mode === "list" && (
          <AppButton
            label="Thêm cấu hình"
            leftSection={<Plus className="h-4 w-4" />}
            showArrow={false}
            onClick={openCreate}
          />
        )}
      </div>

      {mode !== "list" && (
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Text fw={700} mb="md">
            {mode === "create" ? "Thêm cấu hình mới" : "Sửa cấu hình"}
          </Text>
          <ProviderForm
            initial={editingProvider}
            isSaving={isSaving}
            onSubmit={onSubmit}
            onCancel={closeForm}
            onTestDraft={testDraft}
          />
        </Card>
      )}

      {isFetching ? (
        <Stack gap="md">
          <Skeleton height={140} radius="md" />
          <Skeleton height={140} radius="md" />
        </Stack>
      ) : providers && providers.length > 0 ? (
        <Stack gap="md">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              testResult={testResults[provider.id]}
              onEdit={() => openEdit(provider)}
              onDelete={() => remove(provider.id)}
              onToggleActive={(isActive) => toggleActive(provider.id, isActive)}
              onTest={() => testSaved(provider.id)}
            />
          ))}
        </Stack>
      ) : (
        <Group justify="center" p="xl">
          <Text c="dimmed">Chưa có cấu hình nào. Hãy thêm một cấu hình mới.</Text>
        </Group>
      )}
    </div>
  );
}
