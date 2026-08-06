import { Card, Badge, Text, Group, ActionIcon, Alert } from "@mantine/core";
import { Pencil, Trash2, Zap, PlugZap } from "lucide-react";
import { cn } from "@/components/ui/utils";
import type {
  ProviderProfile,
  TestConnectionResult,
} from "@/services/api/aiChatService";

interface ProviderCardProps {
  provider: ProviderProfile;
  testResult?: TestConnectionResult;
  onEdit: () => void;
  onDelete: () => void;
  onActivate: () => void;
  onTest: () => void;
}

export function ProviderCard({
  provider,
  testResult,
  onEdit,
  onDelete,
  onActivate,
  onTest,
}: ProviderCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={cn(provider.isActive && "border-navy-600 ring-1 ring-navy-600/30")}
    >
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text fw={700}>{provider.name}</Text>
          {provider.isActive && (
            <Badge color="blue" variant="light">
              Đang dùng
            </Badge>
          )}
        </Group>
        <Group gap="xs">
          {!provider.isActive && (
            <ActionIcon variant="light" color="blue" onClick={onActivate} title="Kích hoạt">
              <Zap className="h-4 w-4" />
            </ActionIcon>
          )}
          <ActionIcon variant="light" onClick={onTest} title="Thử kết nối">
            <PlugZap className="h-4 w-4" />
          </ActionIcon>
          <ActionIcon variant="light" onClick={onEdit} title="Sửa">
            <Pencil className="h-4 w-4" />
          </ActionIcon>
          <ActionIcon variant="light" color="red" onClick={onDelete} title="Xoá">
            <Trash2 className="h-4 w-4" />
          </ActionIcon>
        </Group>
      </Group>

      <Text size="sm" c="dimmed">
        {provider.provider} · {provider.baseUrl}
      </Text>
      <Text size="sm" c="dimmed">
        Model: {provider.model}
      </Text>
      <Text size="sm" c="dimmed">
        API Key: {provider.hasApiKey ? provider.apiKeyMasked : "Chưa cấu hình"}
      </Text>

      {testResult && (
        <Alert mt="sm" color={testResult.ok ? "green" : "red"}>
          {testResult.message}
        </Alert>
      )}
    </Card>
  );
}
