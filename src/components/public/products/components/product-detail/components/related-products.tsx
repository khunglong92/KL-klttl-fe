import { useTranslation } from "react-i18next";
import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRelatedProducts } from "../../../hooks/use-related-products";
import { ProductCard } from "../../product-card";

interface RelatedProductsProps {
  categoryId?: number;
  currentProductId?: number;
}

export function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const { t } = useTranslation();
  const { products, loading, loadMore, hasMore, isFetchingNextPage } =
    useRelatedProducts(categoryId, currentProductId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto load more when scrolling near the end
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasMore || isFetchingNextPage) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;

      // Load more when scrolled to 80% of the width
      if (scrollPercentage > 0.8 && hasMore && !isFetchingNextPage) {
        loadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetchingNextPage, loadMore]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">
          {t("productDetail.relatedProducts.title", "Sản phẩm liên quan")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[360px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 relative">
      <h2 className="mb-6 text-2xl font-bold">
        {t("productDetail.relatedProducts.title", "Sản phẩm liên quan")}
      </h2>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollLeft}
        className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-md shadow-xl rounded-full h-12 w-12 border-2 border-white/20 hover:bg-background hover:scale-110 transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollRight}
        className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-md shadow-xl rounded-full h-12 w-12 border-2 border-white/20 hover:bg-background hover:scale-110 transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div
        ref={scrollContainerRef}
        className="flex gap-14 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-[300px]">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price ? Number(product.price) : null}
              images={product.images || []}
              description={product.description}
              variant="default"
              className="w-full"
            />
          </div>
        ))}

        {/* Loading indicator when fetching more */}
        {isFetchingNextPage && (
          <div className="shrink-0 w-[240px] flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              {t("common.loading", "Đang tải thêm...")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
