import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFeaturedProducts } from "@/services/hooks/useProducts";
import type { FeaturedProductsResponse } from "@/services/api/productsService";
import { Link } from "@tanstack/react-router";
import { ProductCard } from "../products/components/product-card";

export function FeaturedProducts() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeaturedProducts(10);

  // Flatten all products from pages (explicitly cast pages for TS)
  const pages = (data?.pages as FeaturedProductsResponse[] | undefined) ?? [];
  const allProducts = pages?.flatMap((page) => page?.data ?? []) ?? [];

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

  if (isLoading) {
    return (
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-10 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4">{t("products.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("products.description")}
          </p>
        </motion.div>

        {/* Scroll Container */}
        <div className="relative px-12 md:px-16">
          {/* Scroll Buttons - Outside carousel */}
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
            className="flex gap-x-4 overflow-x-auto scrollbar-hide pb-0 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {allProducts?.map((product) => (
              <div key={product.id} className="shrink-0 w-[280px]">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price ? Number(product.price) : null}
                  images={product.images ?? []}
                  description={product.description}
                  category={product.category}
                  warrantyPolicy={product.warrantyPolicy}
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

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="group relative overflow-hidden rounded-lg bg-black/10 backdrop-blur-md border-white/30 text-foreground hover:bg-black/20 hover:text-foreground transition-all duration-300"
          >
            {/* Glow for outline button - contained */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-lg bg-white/15 blur-lg z-0"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Subtle sweeping shine */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-50 mix-blend-screen"
              initial={{ x: "-120%" }}
              animate={{ x: ["-120%", "120%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Link
              to="/products"
              className="relative z-10 inline-flex items-center font-semibold"
            >
              {t("products.viewAll")}
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Note: Native scrollbar hidden via vendor styles set on container style prop above */}
    </section>
  );
}
