import { Group, Text, Badge } from "@mantine/core";
import type { AiChatErrorLog } from "@/services/api/aiChatService";

export function ErrorLogRow({ log }: { log: AiChatErrorLog }) {
  return (
    <div className="rounded-lg border border-accent-red-200 bg-accent-red-50 p-3">
      <Group justify="space-between" mb={4}>
        <Group gap="xs">
          <Badge color="red" variant="light">
            {log.providerName ?? "Không xác định"}
          </Badge>
          {log.sessionId && (
            <Text size="xs" c="dimmed" className="truncate">
              Phiên: {log.sessionId}
            </Text>
          )}
        </Group>
        <Text size="xs" c="dimmed">
          {new Date(log.createdAt).toLocaleString("vi-VN")}
        </Text>
      </Group>
      <Text size="sm" className="whitespace-pre-wrap text-accent-red-700">
        {log.errorMessage}
      </Text>
    </div>
  );
}
