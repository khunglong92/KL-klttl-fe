import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFeaturedServices } from "@/services/hooks/useServices";
import type { PaginatedServicesResponse } from "@/services/api/servicesService";
import { Link } from "@tanstack/react-router";
import { ServiceCard } from "./service-card";

export function FeaturedServices() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeaturedServices(10);

  const pages = (data?.pages as PaginatedServicesResponse[] | undefined) ?? [];
  const allServices = pages?.flatMap((page) => page?.data ?? []) ?? [];

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
      <section id="featured-services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-services"
      className="py-16 md:py-24 bg-white dark:bg-navy-950"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-accent-red tracking-widest uppercase mb-2">
            Dịch vụ của chúng tôi
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-12 h-[2px] bg-accent-red mb-1 opacity-20" />
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-accent-red" />
          </div>
        </div>

        {/* Scroll Container */}
        <div className="relative group">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-navy-800 text-accent-red shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-navy-700 active:scale-95"
            aria-label="Previous services"
          >
            <ChevronLeft className="w-6 h-6 stroke-2" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white dark:bg-navy-800 text-accent-red shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100 dark:border-navy-700 active:scale-95"
            aria-label="Next services"
          >
            <ChevronRight className="w-6 h-6 stroke-2" />
          </button>

          {/* Services Horizontal Scroll */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {allServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                className="w-full min-w-[300px] md:min-w-[calc(33.333%-22px)] max-w-[400px]"
              />
            ))}

            {/* Loading indicator */}
            {isFetchingNextPage && (
              <div className="shrink-0 w-[240px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
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
              to="/services"
              className="relative z-10 inline-flex items-center font-semibold"
            >
              {t("services.viewAll")}
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
