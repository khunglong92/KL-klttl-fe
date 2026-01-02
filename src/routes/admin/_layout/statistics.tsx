import { createFileRoute } from "@tanstack/react-router";
import { AdminStatistics } from "@/page/admin/dashboard/admin-statistics";

export const Route = createFileRoute("/admin/_layout/statistics")({
  component: AdminStatistics,
});
