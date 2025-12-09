import AdminContactManagerPage from "@/page/admin/dashboard/admin-contacts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/contact")({
  component: AdminContactManagerPage,
});
