import { createFileRoute } from "@tanstack/react-router";
import PriceQuoteDetailPage from "@/page/public/price-quote/detail";

export const Route = createFileRoute("/quote/$priceQuoteId")({
  component: PriceQuoteDetailPage,
});
