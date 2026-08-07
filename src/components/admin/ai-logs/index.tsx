import { useState } from "react";
import { Stack, Skeleton, Group, Pagination, Text } from "@mantine/core";
import { useAiChatErrorLogs } from "@/services/hooks/useAiChat";
import { ErrorLogRow } from "./components/error-log-row";

const PAGE_SIZE = 20;

export default function AiChatLogsManager() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useAiChatErrorLogs({ page, pageSize: PAGE_SIZE });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Audit lỗi AI</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Danh sách lỗi khi gọi nhà cung cấp AI (sai key, hết quota, timeout, tất cả
          provider fallback đều lỗi...) — theo dõi ở đây để xử lý kịp thời, không cần
          đọc lại toàn bộ lịch sử chat.
        </p>
      </div>

      {isFetching ? (
        <Stack gap="md">
          <Skeleton height={60} radius="md" />
          <Skeleton height={60} radius="md" />
        </Stack>
      ) : data && data.logs.length > 0 ? (
        <Stack gap="sm">
          {data.logs.map((log) => (
            <ErrorLogRow key={log.id} log={log} />
          ))}

          <Group justify="center" mt="md">
            <Pagination
              total={Math.ceil(data.total / PAGE_SIZE)}
              value={page}
              onChange={setPage}
              color="blue"
            />
          </Group>
        </Stack>
      ) : (
        <Group justify="center" p="xl">
          <Text c="dimmed">Chưa có lỗi nào được ghi nhận. Chatbot đang hoạt động tốt.</Text>
        </Group>
      )}
    </div>
  );
}
