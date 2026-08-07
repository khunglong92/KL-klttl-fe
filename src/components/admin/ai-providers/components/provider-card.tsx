import { Card, Badge, Text, Group, ActionIcon, Alert, Switch } from "@mantine/core";
import { Pencil, Trash2, PlugZap } from "lucide-react";
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
  onToggleActive: (isActive: boolean) => void;
  onTest: () => void;
}

export function ProviderCard({
  provider,
  testResult,
  onEdit,
  onDelete,
  onToggleActive,
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
              Đang bật · fallback #{provider.priority}
            </Badge>
          )}
        </Group>
        <Group gap="xs">
          <Switch
            checked={provider.isActive}
            onChange={(e) => onToggleActive(e.currentTarget.checked)}
            label="Bật"
          />
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
