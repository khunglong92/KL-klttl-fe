import AdminProjects from "@/page/admin/dashboard/projects";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/projects")({
  component: AdminProjects,
});
