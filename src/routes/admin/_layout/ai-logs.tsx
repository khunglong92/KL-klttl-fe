import AdminAiChatLogsPage from "@/page/admin/dashboard/ai-logs";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/ai-logs")({
  component: AdminAiChatLogsPage,
});
