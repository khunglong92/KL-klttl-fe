import { useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/services/hooks/useCategories";
import { productsService, type Product } from "@/services/api/productsService";
import { Link } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AppThumbnailImage } from "../common/app-thumbnail-image";
import { AnimatedTitle } from "@/components/public/products/components/animated-title";

// New Simple Card: 3/4 Image, Content Bottom, Shadow
function SimpleProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();

  return (
    <div className="group relative w-[280px] bg-white dark:bg-navy-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-navy-700 flex flex-col h-[420px]">
      {/* Image Area - 3/4 Height (~315px) */}
      <div className="h-[75%] w-full overflow-hidden bg-gray-50 relative">
        <AppThumbnailImage
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Area - Bottom */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-white dark:bg-navy-900 relative z-10">
        <h3
          className="text-lg font-bold text-black line-clamp-2 group-hover:text-accent-red transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="pt-2 border-t border-gray-100 dark:border-white/10 mt-2">
          <Link to="/contact" className="block w-full text-center group/btn">
            <span className="inline-block text-red-500 font-bold text-base tracking-wide transition-transform duration-200 group-hover/btn:scale-110">
              {t("contact.title") || "Liên hệ"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    return (
      <div ref={containerRef} className="mb-20 last:mb-0 px-4">
        {/* Use AnimatedTitle even for empty state for consistency */}
        <div className="mb-8">
          <AnimatedTitle
            number={index < 9 ? `0${index + 1}` : `${index + 1}`}
            title={categoryName}
          />
        </div>
        <div className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-navy-900/50 rounded-xl border border-dashed border-gray-200 dark:border-navy-700 italic">
          Danh mục này chưa có sản phẩm nào.
        </div>
      </div>
    );
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

      <div className="relative px-2 md:px-6">
        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-navy-800 text-accent-red shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-navy-700 active:scale-95"
          aria-label="Previous products"
        >
          <ChevronLeft className="w-6 h-6 stroke-2" />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={onScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product: any) => (
            <div key={product.id} className="snap-center shrink-0">
              <SimpleProductCard product={product} />
            </div>
          ))}
          {isFetchingNextPage && (
            <div className="snap-center shrink-0 w-[280px] h-[420px] flex flex-col items-center justify-center bg-gray-50 dark:bg-navy-900/50 rounded-xl border border-dashed border-gray-200 dark:border-navy-700">
              <div className="w-8 h-8 border-4 border-accent-red border-t-transparent rounded-full animate-spin mb-4" />
              <span className="text-sm text-gray-400">Đang tải thêm...</span>
            </div>
          )}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-navy-800 text-accent-red shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-navy-700 active:scale-95"
          aria-label="Next products"
        >
          <ChevronRight className="w-6 h-6 stroke-2" />
        </button>
      </div>

      {/* View More Button */}
      <div className="mt-10 text-center">
        <Link
          to="/products"
          search={{ categoryId }}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 dark:border-navy-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-navy-800 transition-all text-black hover:text-accent-red hover:border-accent-red shadow-sm hover:shadow-md"
        >
          Xem tất cả sản phẩm {categoryName}
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data: categories, isLoading } = useCategories();
  if (isLoading) {
    return (
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">Loading...</div>
      </section>
    );
  }

  return (
    <section
      id="featured"
      className="py-16 md:py-24 bg-gray-50/50 dark:bg-navy-950/50"
    >
      <div className="container mx-auto">
        {/* Categories Loop */}
        <div className="max-w-7xl mx-auto">
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
