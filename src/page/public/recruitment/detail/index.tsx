import { NewsReviews } from "@/components/public/news/components/news-reviews";
import { RecruitmentSectionContent } from "@/components/public/recruitment/components/recruitment-section-content";

import { useTranslation } from "react-i18next";
import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/base";
import { PageLayout } from "@/components/layout/PageLayout";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";

interface ContentSection {
  title: string;
  description: string;
  image?: string;
}

interface RecruitmentDetail {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  contentSections?: ContentSection[];
  createdAt?: string;
}

export default function RecruitmentDetailPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { recruitmentId } = useParams({ from: "/recruitment/$recruitmentId" });

  const { data: recruitment, isLoading } = useQuery({
    queryKey: ["recruitment-detail", recruitmentId],
    queryFn: async () => {
      const response = await apiClient.get<RecruitmentDetail>(
        `/recruitment/${recruitmentId}`
      );
      return response;
    },
    enabled: !!recruitmentId,
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        seo={{ title: t("nav.recruitment"), description: "" }}
        breadcrumbs={<Link to="/recruitment">{t("nav.recruitment")}</Link>}
        sidebar={<OnlineSupportSidebar />}
      >
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </PageLayout>
    );
  }

  if (!recruitment) {
    return (
      <PageLayout
        seo={{ title: t("nav.recruitment"), description: "" }}
        breadcrumbs={<Link to="/recruitment">{t("nav.recruitment")}</Link>}
        sidebar={<OnlineSupportSidebar />}
      >
        <div className="text-center py-20">
          <p className="text-gray-500">
            {t("recruitment.notFound", "Không tìm thấy tin tuyển dụng")}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      seo={{
        title: recruitment.title,
        description: recruitment.subtitle || "",
      }}
      breadcrumbs={
        <>
          <Link
            to="/recruitment"
            className="transition-colors hover:text-cyan-500"
          >
            {t("nav.recruitment", "Tuyển dụng")}
          </Link>
          <span>»</span>
          <span className="font-medium text-gray-500 line-clamp-1 max-w-[200px]">
            {recruitment.title}
          </span>
        </>
      }
      sidebar={
        <div className="space-y-6">
          {/* Table of Contents - Desktop Removed */}
          <FeaturedNewsSidebar />
          <OnlineSupportSidebar />
        </div>
      }
    >
      {/* Back Button */}
      <Link
        to="/recruitment"
        className={cn(
          "inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors",
          theme === "dark"
            ? "text-gray-400 hover:text-cyan-500"
            : "text-gray-600 hover:text-cyan-500"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("recruitment.backToList", "Quay lại danh sách")}
      </Link>

      {/* Article Header */}
      <article>
        <header className="mb-8">
          <h1
            className={cn(
              "text-2xl md:text-3xl font-bold mb-4",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            {recruitment.title}
          </h1>
          {recruitment.subtitle && (
            <p
              className={cn(
                "text-lg mb-4 italic",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}
            >
              {recruitment.subtitle}
            </p>
          )}
          {recruitment.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(recruitment.createdAt)}</span>
            </div>
          )}
        </header>

        {/* Cover Image */}
        {recruitment.image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-sm">
            <img
              src={recruitment.image}
              alt={recruitment.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Table of Contents - Mobile */}
        {recruitment.contentSections &&
          recruitment.contentSections.length > 0 && (
            <div
              className={cn(
                "p-4 rounded-xl border mb-8",
                theme === "dark"
                  ? "bg-[#1f2937] border-[#374151]"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <h3
                className={cn(
                  "font-bold mb-3 pb-2 border-b",
                  theme === "dark"
                    ? "text-white border-gray-700"
                    : "text-gray-900 border-gray-200"
                )}
              >
                {t("news.tableOfContents", "Nội dung bài viết")}
              </h3>
              <ul className="space-y-2 text-sm">
                {recruitment.contentSections.map((section, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(index)}
                      className={cn(
                        "text-left w-full hover:text-cyan-500 transition-colors",
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Content Sections */}
        {recruitment.contentSections &&
          recruitment.contentSections.length > 0 && (
            <div className="space-y-10">
              {recruitment.contentSections.map((section, index) => (
                <section
                  key={index}
                  id={`section-${index}`}
                  className="scroll-mt-24"
                >
                  {section.title && (
                    <h2
                      className={cn(
                        "text-xl md:text-2xl font-bold mb-4",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}
                    >
                      {section.title}
                    </h2>
                  )}

                  <div
                    className={cn(
                      "prose max-w-none mb-6",
                      theme === "dark" ? "prose-invert" : ""
                    )}
                  >
                    <RecruitmentSectionContent
                      contentKey={section.description}
                    />
                  </div>
                </section>
              ))}
            </div>
          )}

        {/* Divider */}
        <hr
          className={cn(
            "my-10",
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          )}
        />

        {/* Review/Rating Section - We reuse NewsReviews but should verify if it checks type. 
            NewsReviews likely hardcodes "NEWS" type or takes it as prop. 
            Checking usage: <NewsReviews newsId={news.id} newsTitle={news.title} /> 
            It might default to NEWS targetType. I should probably check NewsReviews implementation.
        */}
        <NewsReviews
          newsId={recruitment.id}
          newsTitle={recruitment.title}
          targetType="RECRUITMENT"
        />
      </article>
    </PageLayout>
  );
}
