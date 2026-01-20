import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { useProjectsPublic } from "@/components/public/projects/hooks/use-projects-public";
import { ProjectCard } from "./project-card";

export function FeaturedProjects() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { projects, loading: isLoading } = useProjectsPublic();

  const featuredProjects = projects.filter((p) => p.isFeatured);
  // Fallback: if no featured projects, use all projects
  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects : projects;

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

  if (isLoading) {
    return null;
  }

  // Don't render if no data
  if (!displayProjects || displayProjects.length === 0) {
    return null;
  }

  return (
    <section
      id="featured-projects"
      className={cn(
        "py-16 md:py-24",
        theme === "dark" ? "bg-navy-950/50" : "bg-gray-50/50",
      )}
    >
      <div className="w-full px-4">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-accent-red tracking-widest uppercase mb-2">
            {t("projects.featured.title") || "Dự án tiêu biểu"}
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
            className={cn(
              "absolute -left-6 md:-left-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95",
              theme === "dark"
                ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                : "bg-white border border-gray-100 text-accent-red",
            )}
            aria-label="Previous projects"
          >
            <ChevronLeft className="w-6 h-6 stroke-2" />
          </button>

          <button
            onClick={scrollRight}
            className={cn(
              "absolute -right-6 md:-right-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95",
              theme === "dark"
                ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                : "bg-white border border-gray-100 text-accent-red",
            )}
            aria-label="Next projects"
          >
            <ChevronRight className="w-6 h-6 stroke-2" />
          </button>

          {/* Projects Horizontal Scroll */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory px-4 md:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                className="w-[85%] md:w-full min-w-[280px] md:min-w-[calc(33.333%-22px)] max-w-[400px] snap-center shrink-0"
                overlayVariant="sky"
              />
            ))}
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
              to="/projects"
              className="relative z-10 inline-flex items-center font-semibold"
            >
              {t("projects.viewAll") || "Xem tất cả dự án"}
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
