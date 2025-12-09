import AdminQuotesPage from "@/components/admin/quotes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/quotes")({
  component: AdminQuotesPage,
});
