import { AdminDashboard } from "@/page/admin/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/dashboard")({
  component: AdminDashboard,
});
