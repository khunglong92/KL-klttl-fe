import AdminAiSettingsPage from "@/page/admin/dashboard/ai-settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/ai-settings")({
  component: AdminAiSettingsPage,
});
