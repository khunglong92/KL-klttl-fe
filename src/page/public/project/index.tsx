import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectsPublic } from "@/components/public/projects/hooks/use-projects-public";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { FeaturedProjectsSidebar } from "@/components/public/introduction/sidebar/featured-projects-sidebar";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import {
  SimpleProjectCard,
  CompactProjectCard,
} from "@/components/public/projects/components/project-cards";
import { ProjectSearchBar } from "@/components/public/projects/components/project-search-bar";
import { ProjectPagination } from "@/components/public/projects/components/project-pagination";

export default function ProjectsListPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [page, setPage] = useState(1);
  const perpage = 12;

  // Fetch projects
  const { projects: allProjects, loading: isLoading } = useProjectsPublic();

  // Client-side filtering by category and search
  const filteredProjects = allProjects.filter((project) => {
    // Filter by search
    if (!debouncedSearch) return true;
    const searchLower = debouncedSearch.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.shortDescription?.toLowerCase().includes(searchLower)
    );
  });

  const total = filteredProjects.length;
  const totalPages = Math.ceil(total / perpage);
  const startIdx = (page - 1) * perpage;
  const projects = filteredProjects.slice(startIdx, startIdx + perpage);

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <PageLayout
      seo={{
        title: t("nav.project"),
        description: t("projects.hero.description"),
      }}
      breadcrumbs={
        <>
          <Link to="/projects" className={cn("font-medium transition-colors")}>
            {t("nav.project", "Dự án")}
          </Link>
        </>
      }
      sidebar={
        <>
          <FeaturedProjectsSidebar />
          <OnlineSupportSidebar />
        </>
      }
    >
      {/* Search & Controls Bar */}
      <ProjectSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalShowing={projects.length}
        totalProjects={total}
      />

      {/* Project List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : projects.length > 0 ? (
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
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <SimpleProjectCard project={project} />
                  ) : (
                    <CompactProjectCard project={project} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {/* Pagination */}
          <ProjectPagination
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
            <div className="text-4xl mb-3">🏗️</div>
            <p
              className={cn(
                "text-base font-medium",
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("projects.filter.noProjects", "Không tìm thấy dự án nào")}
            </p>
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
