import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "./product-card";
import { useProductsByCategory } from "../hooks/use-products-by-category";
import { Button } from "@/components/ui/button";

interface AutoScrollCarouselProps {
  categoryId?: number;
}

export function AutoScrollCarousel({ categoryId }: AutoScrollCarouselProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Only fetch data when component is visible
  const { products, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useProductsByCategory(categoryId, { enabled: isVisible });

  // Intersection Observer to detect when component enters viewport
  useEffect(() => {
    const currentRef = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

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

  // Load more when scrolling near the end
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;

      if (scrollPercentage > 0.8 && hasNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Show placeholder if not visible yet
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-7xl px-12 md:px-16 min-h-[400px] flex items-center justify-center"
      >
        <div className="text-muted-foreground text-sm">Đang tải...</div>
      </div>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-7xl px-12 md:px-16"
    >
      {/* Scroll Buttons */}
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

      {/* Products Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        className="flex gap-10 overflow-x-auto scrollbar-hide pb-0 scroll-smooth"
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
              images={product.images ?? []}
              description={product.description ?? null}
              warrantyPolicy={product.warrantyPolicy}
              category={product.category}
              variant="compact"
              className="w-full"
            />
          </div>
        ))}

        {/* Loading indicator */}
        {isFetchingNextPage && (
          <div className="shrink-0 w-[240px] flex items-center justify-center">
            <div className="text-muted-foreground text-sm">
              Đang tải thêm...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
