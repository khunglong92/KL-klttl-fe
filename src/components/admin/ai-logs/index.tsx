import { useState } from "react";
import { Stack, Skeleton, Group, Pagination, Text } from "@mantine/core";
import { useAiChatLogs } from "@/services/hooks/useAiChat";
import { ChatLogSessionCard } from "./components/chat-log-session-card";

const PAGE_SIZE = 20;

export default function AiChatLogsManager() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useAiChatLogs({ page, pageSize: PAGE_SIZE });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Nhật ký hội thoại</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách các phiên trò chuyện với trợ lý AI trên trang public.
        </p>
      </div>

      {isFetching ? (
        <Stack gap="md">
          <Skeleton height={60} radius="md" />
          <Skeleton height={60} radius="md" />
        </Stack>
      ) : data && data.sessions.length > 0 ? (
        <Stack gap="md">
          {data.sessions.map((session) => (
            <ChatLogSessionCard key={session.sessionId} session={session} />
          ))}

          <Group justify="center" mt="md">
            <Pagination
              total={Math.ceil(data.totalSessions / PAGE_SIZE)}
              value={page}
              onChange={setPage}
              color="blue"
            />
          </Group>
        </Stack>
      ) : (
        <Group justify="center" p="xl">
          <Text c="dimmed">Chưa có phiên trò chuyện nào.</Text>
        </Group>
      )}
    </div>
  );
}
