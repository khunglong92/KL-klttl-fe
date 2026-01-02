import { createFileRoute } from "@tanstack/react-router";
import PriceQuoteListPage from "@/page/public/price-quote";

export const Route = createFileRoute("/quote/")({
  component: PriceQuoteListPage,
});
