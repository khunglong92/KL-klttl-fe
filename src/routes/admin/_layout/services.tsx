import AdminServices from "@/page/admin/dashboard/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/services")({
  component: AdminServices,
});
