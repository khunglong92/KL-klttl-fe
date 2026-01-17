import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Link, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { ProductCategoriesSidebar } from "@/components/public/introduction/sidebar/product-categories-sidebar";
import { PageLayout } from "@/components/layout/PageLayout";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "@/services/hooks/useProducts";
import { useCategories } from "@/services/hooks/useCategories";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  SimpleProductCard,
  CompactProductCard,
} from "@/components/public/products/components/product-cards";
import { ProductSearchBar } from "@/components/public/products/components/product-search-bar";
import { ProductPagination } from "@/components/public/products/components/product-pagination";
import { FeaturedServicesSidebar } from "@/components/public/introduction/sidebar/featured-services-sidebar";

export default function ProductsPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [page, setPage] = useState(1);
  const limit = 12;

  // Get categoryId from search params
  const search = useSearch({ strict: false });
  const categoryId = (search as any).categoryId;

  // Fetch categories
  const { data: categories } = useCategories();
  const activeCategory = useMemo(() => {
    if (!categoryId || !categories) return null;
    return categories.find((cat) => cat.id === Number(categoryId));
  }, [categoryId, categories]);

  // Fetch products with search and pagination
  const { data: productsData, isLoading } = useProducts({
    categoryId: categoryId ? Number(categoryId) : undefined,
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const products = productsData?.data || [];
  const total = productsData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <PageLayout
      seo={{
        title: activeCategory
          ? `${t("nav.products")} - ${activeCategory.name}`
          : t("nav.products"),
        description: t("products.description"),
        keywords: `sản phẩm kim loại, ${activeCategory?.name || "tủ locker, xe đẩy, thiết bị công nghiệp"}, gia công kim loại, Thiên Lộc`,
      }}
      breadcrumbs={
        <>
          <Link
            to="/products"
            className={cn(
              "transition-colors",
              !activeCategory && "font-medium"
            )}
          >
            {t("nav.products", "Sản phẩm")}
          </Link>
          {activeCategory && (
            <>
              <p>»</p>
              <span className="font-medium text-gray-500">
                {activeCategory.name}
              </span>
            </>
          )}
        </>
      }
      sidebar={
        <>
          <ProductCategoriesSidebar showAllOption={true} />
          <OnlineSupportSidebar />
          <FeaturedServicesSidebar />
        </>
      }
    >
      {/* Search & Controls Bar */}
      <ProductSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalShowing={products.length}
        totalProducts={total}
      />

      {/* Product List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : products.length > 0 ? (
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
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <SimpleProductCard product={product} />
                  ) : (
                    <CompactProductCard product={product} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <ProductPagination
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
              {t("products.filter.updating", "Đang cập nhật thông tin...")}
            </p>
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
