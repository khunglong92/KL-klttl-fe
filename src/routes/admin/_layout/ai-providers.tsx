import AdminAiProvidersPage from "@/page/admin/dashboard/ai-providers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/ai-providers")({
  component: AdminAiProvidersPage,
});
