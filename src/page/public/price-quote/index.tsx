import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { priceQuotesService } from "@/services/api/priceQuotesService";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { NewsSearchBar } from "@/components/public/news/components/news-search-bar";
import { NewsPagination } from "@/components/public/news/components/news-pagination";
import {
  SimpleNewsCard,
  CompactNewsCard,
} from "@/components/public/news/components/news-cards";

export default function PriceQuoteListPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Fetch quotes
  const { data: quotesData, isLoading } = useQuery({
    queryKey: ["public-price-quotes", page, debouncedSearch],
    queryFn: async () => {
      const response = await priceQuotesService.getAll({
        page,
        perPage,
        search: debouncedSearch,
      });
      return response;
    },
  });

  const quotes = quotesData?.data || [];
  const total = quotesData?.total || 0;
  const totalPages = quotesData?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <PageLayout
      seo={{
        title: t("nav.priceQuotes", "Báo giá"),
        description: t("priceQuotes.description", "Bảng báo giá mới nhất"),
      }}
      breadcrumbs={
        <>
          <Link to="/quote" className={cn("font-medium transition-colors")}>
            {t("nav.priceQuotes", "Báo giá")}
          </Link>
        </>
      }
      sidebar={
        <>
          <FeaturedNewsSidebar />
          <OnlineSupportSidebar />
        </>
      }
    >
      {/* Reuse News components for Search & Cards since structure is identical */}
      <NewsSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalShowing={quotes.length}
        totalNews={total}
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : quotes.length > 0 ? (
        <>
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            <AnimatePresence mode="popLayout">
              {quotes.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <SimpleNewsCard
                      news={item as any}
                      baseUrl="/quote"
                      paramKey="priceQuoteId"
                    />
                  ) : (
                    <CompactNewsCard
                      news={item as any}
                      baseUrl="/quote"
                      paramKey="priceQuoteId"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <NewsPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "min-h-[300px] flex items-center justify-center rounded-xl border border-dashed",
            theme === "dark"
              ? "border-gray-700 bg-[#242830]/50"
              : "border-gray-200 bg-gray-50/50"
          )}
        >
          <div className="text-center p-8">
            <div className="text-4xl mb-3">📰</div>
            <p
              className={cn(
                "text-base font-medium",
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("priceQuotes.updating", "Đang cập nhật thông tin...")}
            </p>
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
