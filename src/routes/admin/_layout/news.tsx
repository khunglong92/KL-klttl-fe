import { AdminNewsPage } from "@/components/admin/news";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/news")({
  component: AdminNewsPage,
});
