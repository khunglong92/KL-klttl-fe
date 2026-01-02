import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useServices } from "@/services/hooks/useServices";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { FeaturedServicesSidebar } from "@/components/public/introduction/sidebar/featured-services-sidebar";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import {
  SimpleServiceCard,
  CompactServiceCard,
} from "@/components/public/service/components/service-cards";
import { ServiceSearchBar } from "@/components/public/service/components/service-search-bar";
import { ServicePagination } from "@/components/public/service/components/service-pagination";
import { ProductCategoriesSidebar } from "@/components/public/introduction/sidebar/product-categories-sidebar";

export default function ServicesListPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [page, setPage] = useState(1);
  const perpage = 12;

  // Fetch services with search and pagination
  const { data: servicesData, isLoading } = useServices({
    search: debouncedSearch || undefined,
    page,
    perpage,
  });

  const services = servicesData?.data || [];
  const total = servicesData?.pagination?.total || 0;
  const totalPages = Math.ceil(total / perpage);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <PageLayout
      seo={{
        title: t("nav.services"),
        description: t("servicesPage.hero.subtitle"),
      }}
      breadcrumbs={
        <>
          <Link to="/services" className={cn("font-medium transition-colors")}>
            {t("nav.services", "Dịch vụ")}
          </Link>
        </>
      }
      sidebar={
        <>
          <FeaturedServicesSidebar />
          <ProductCategoriesSidebar />
          <OnlineSupportSidebar />
        </>
      }
    >
      {/* Search & Controls Bar */}
      <ServiceSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalShowing={services.length}
        totalServices={total}
      />

      {/* Service List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : services.length > 0 ? (
        <>
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            <AnimatePresence mode="popLayout">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <SimpleServiceCard service={service} />
                  ) : (
                    <CompactServiceCard service={service} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <ServicePagination
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
            <div className="text-4xl mb-3">📦</div>
            <p
              className={cn(
                "text-base font-medium",
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("services.filter.updating", "Đang cập nhật thông tin...")}
            </p>
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
