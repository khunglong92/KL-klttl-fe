import { AdminPriceQuotesPage } from "@/components/admin/price-quotes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/quotes")({
  component: AdminPriceQuotesPage,
});
