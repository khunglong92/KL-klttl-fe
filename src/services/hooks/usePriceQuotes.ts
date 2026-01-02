import { useQuery } from "@tanstack/react-query";
import {
  priceQuotesService,
  type PriceQuote,
} from "@/services/api/priceQuotesService";

export const useFeaturedPriceQuotes = (limit?: number) => {
  return useQuery({
    queryKey: ["priceQuotes", "featured", limit],
    queryFn: () => priceQuotesService.getFeatured(limit),
  });
};

export type { PriceQuote };
