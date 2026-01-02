import { createFileRoute } from "@tanstack/react-router";
import AdminCategory from "@/page/admin/dashboard/category";

export const Route = createFileRoute("/admin/_layout/categories")({
  component: AdminCategory,
});
