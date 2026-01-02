import { useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";
import { useCategories } from "@/services/hooks/useCategories";
import { productsService } from "@/services/api/productsService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatedTitle } from "@/components/public/products/components/animated-title";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import AppButton from "@/components/atoms/app-button";
import { SimpleProductCard } from "../products/components/product-cards";

// Carousel Section for a Single Category with Auto-Scroll & Lazy Load
function CategorySection({
  categoryId,
  categoryName,
  index,
}: {
  categoryId: number;
  categoryName: string;
  index: number;
}) {
  const { theme } = useTheme();
  const containerRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<any | null>(null);

  // Lazy Loading Trigger using Framer Motion
  const isInView = useInView(containerRef, {
    once: true,
    margin: "0px 0px 200px 0px",
  });

  // Fetch products for this category only when in view
  const {
    data,
    isLoading,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products-by-category-infinite", categoryId],
    queryFn: ({ pageParam = 1 }) =>
      productsService.findAll({
        limit: 12,
        categoryId,
        page: pageParam,
      }),
    getNextPageParam: (lastPage: any) => {
      const { page, limit, total } = lastPage;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isInView,
  });

  const products = data?.pages.flatMap((page: any) => page.data) || [];

  // Auto-scroll logic from Right to Left
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } =
            scrollContainerRef.current;

          // Check if near end
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            } else if (!isFetchingNextPage) {
              // Loop back to start if no more products
              scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: "smooth",
              });
            }
          } else {
            scrollContainerRef.current.scrollBy({
              left: 304,
              behavior: "smooth",
            });
          }
        }
      }, 3000); // 3 seconds
    };

    if (products.length > 0) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [products.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle manual scroll to load more
  const onScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    }
  };

  const pauseAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const scrollLeft = () => {
    pauseAutoPlay();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -304, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    pauseAutoPlay();
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      // If near end
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
          scrollContainerRef.current.scrollBy({
            left: 304,
            behavior: "smooth",
          });
        } else if (!isFetchingNextPage) {
          // Loop back to start if no more products
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }
      } else {
        scrollContainerRef.current.scrollBy({ left: 304, behavior: "smooth" });
      }
    }
  };

  // If fetched and no products, hide the section layout?
  // We'll show a message as requested.
  if (isFetched && products.length === 0) {
    return null;
  }

  // Initial loading state or just hidden before load (but we need containerRef to trigger load)
  if (!isInView || (isLoading && products.length === 0)) {
    return (
      <div
        ref={containerRef}
        className="mb-24 last:mb-0 min-h-[400px] flex items-center justify-center"
      >
        {isInView ? (
          <div className="text-gray-400">
            Đang tải sản phẩm '{categoryName}'...
          </div>
        ) : (
          <div className="h-1 w-full" />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mb-24 last:mb-0 relative group/section"
      onMouseEnter={pauseAutoPlay}
    >
      {/* Category Title */}
      <div className="px-4 mb-6">
        <AnimatedTitle
          number={index < 9 ? `0${index + 1}` : `${index + 1}`}
          title={categoryName}
        />
      </div>

      <div className="relative group">
        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className={cn(
            "absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95",
            theme === "dark"
              ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
              : "bg-white border border-gray-100 text-accent-red"
          )}
          aria-label="Previous products"
        >
          <ChevronLeft className="w-6 h-6 stroke-2" />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={onScroll}
          className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory px-4 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product: any) => (
            <div
              key={product.id}
              className="shrink-0 w-[85%] md:w-full min-w-[280px] md:min-w-[calc(33.333%-22px)] max-w-[400px] snap-center"
            >
              <SimpleProductCard product={product} />
            </div>
          ))}
          {isFetchingNextPage && (
            <div className="shrink-0 w-[300px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={scrollRight}
          className={cn(
            "absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95",
            theme === "dark"
              ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
              : "bg-white border border-gray-100 text-accent-red"
          )}
          aria-label="Next products"
        >
          <ChevronRight className="w-6 h-6 stroke-2" />
        </button>
      </div>

      {/* View More Button */}
      <div className="mt-10 text-center">
        <AppButton
          label={`Xem tất cả sản phẩm ${categoryName}`}
          to={`/products?categoryId=${categoryId}`}
          variant="outline-primary"
          size="lg"
          noBorder
        />
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { theme } = useTheme();
  const { data: categories, isLoading } = useCategories();
  if (isLoading) {
    return (
      <section id="featured" className="py-16 md:py-24">
        <div className="w-full px-4 text-center">Loading...</div>
      </section>
    );
  }

  return (
    <section
      id="featured"
      className={cn(
        "py-16 md:py-24",
        theme === "dark" ? "bg-navy-950/50" : "bg-gray-50/50"
      )}
    >
      <div className="w-full px-4">
        {/* Categories Loop */}
        <div className="w-full mx-auto">
          {categories?.map((category, index) => (
            <CategorySection
              key={category.id}
              categoryId={category.id}
              categoryName={category.name}
              index={index}
            />
          ))}

          {categories?.length === 0 && (
            <div className="text-center text-gray-500">
              Chưa có danh mục nào.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
