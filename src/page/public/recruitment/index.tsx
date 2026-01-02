import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/base";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  SimpleRecruitmentCard,
  CompactRecruitmentCard,
} from "@/components/public/recruitment/components/recruitment-cards";
import { RecruitmentSearchBar } from "@/components/public/recruitment/components/recruitment-search-bar";
import { RecruitmentPagination } from "@/components/public/recruitment/components/recruitment-pagination";

interface Recruitment {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
}

interface RecruitmentResponse {
  data: Recruitment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export default function RecruitmentListPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const [page, setPage] = useState(1);
  const perPage = 12;

  // Fetch recruitment
  const { data: recruitmentData, isLoading } = useQuery({
    queryKey: ["public-recruitment", page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
      });
      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }
      const response = await apiClient.get<RecruitmentResponse>(
        `/recruitment?${params.toString()}`
      );
      return response;
    },
  });

  const recruitment = recruitmentData?.data || [];
  const total = recruitmentData?.total || 0;
  const totalPages = recruitmentData?.totalPages || 1;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <PageLayout
      seo={{
        title: t("nav.recruitment", "Tuyển dụng"),
        description: t(
          "recruitment.description",
          "Thông tin tuyển dụng mới nhất"
        ),
      }}
      breadcrumbs={
        <>
          <Link
            to="/recruitment"
            className={cn("font-medium transition-colors")}
          >
            {t("nav.recruitment", "Tuyển dụng")}
          </Link>
        </>
      }
      sidebar={
        <>
          <OnlineSupportSidebar />
        </>
      }
    >
      {/* Search & Controls Bar */}
      <RecruitmentSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalShowing={recruitment.length}
        totalRecruitment={total}
      />

      {/* Recruitment List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      ) : recruitment.length > 0 ? (
        <>
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
            )}
          >
            <AnimatePresence mode="popLayout">
              {recruitment.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  {viewMode === "grid" ? (
                    <SimpleRecruitmentCard recruitment={item} />
                  ) : (
                    <CompactRecruitmentCard recruitment={item} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          <RecruitmentPagination
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
            <div className="text-4xl mb-3">👥</div>
            <p
              className={cn(
                "text-base font-medium",
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t("recruitment.updating", "Đang cập nhật thông tin...")}
            </p>
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
}
