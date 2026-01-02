import { useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useProjectDetail } from "@/components/public/projects/hooks/use-projects-public";
import { Text, Paper, Stack, Loader, Title, Box } from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { FeaturedProjectsSidebar } from "@/components/public/introduction/sidebar/featured-projects-sidebar";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { FeaturedRecruitmentSidebar } from "@/components/public/introduction/sidebar/featured-recruitment-sidebar";
import { ProductCategoriesSidebar } from "@/components/public/introduction/sidebar/product-categories-sidebar";
import { ProjectReviews } from "@/components/public/projects/components/project-reviews";
import { ProductGallery } from "@/components/public/products/components/product-detail/components/product-gallery";
import { FeaturedServicesSidebar } from "@/components/public/introduction/sidebar/featured-services-sidebar";
import AppButton from "@/components/atoms/app-button";
import { DetailedDescription } from "../../products/components/product-detail/components/detailed-description";

export default function ProjectDetailComponent() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const { t } = useTranslation();
  const { project, loading, error } = useProjectDetail(projectId);
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (loading) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Loader size="xl" />
        <Text>Loading project details...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Paper p="xl" withBorder shadow="md">
          <Title order={3} c="red">
            Error
          </Title>
          <Text>
            {(error as Error).message || "Failed to load project details."}
          </Text>
        </Paper>
      </Stack>
    );
  }

  if (!project) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Text>{t("projects.detail.notFound", "Không tìm thấy dự án")}</Text>
        <Link to="/projects" className="text-amber-500 hover:underline">
          {t("projects.detail.backToList", "Quay lại danh sách")}
        </Link>
      </Stack>
    );
  }

  // Ensure images is an array
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <div
      className={cn(
        "min-h-screen",
        theme === "dark" ? "bg-navy-950" : "bg-[#f8f9fa]"
      )}
    >
      {/* Breadcrumb */}
      <div
        className={cn(
          "border-b py-3",
          theme === "dark"
            ? "bg-navy-900 border-navy-700"
            : "bg-gray-100/80 border-gray-200"
        )}
      >
        <div className="container mx-auto px-4">
          <nav
            className={cn(
              "flex items-center gap-2 text-sm",
              theme === "dark" ? "text-gray-400" : "text-[#CF0927]"
            )}
          >
            <Link to="/" className="flex items-center gap-1 hover:opacity-80">
              <Home className="h-3.5 w-3.5" />
              {t("nav.home", "Trang chủ")}
            </Link>
            <span>»</span>
            <Link to="/projects" className="hover:opacity-80">
              {t("nav.project", "Dự án")}
            </Link>
            <span>»</span>
            <span
              className={cn(
                "font-medium line-clamp-1 max-w-[200px]",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              {project.title}
            </span>
          </nav>
        </div>
      </div>

      <Box className={`py-6 ${theme === "dark" ? "bg-[#242830]" : "bg-white"}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0 space-y-4 order-2 lg:order-1">
              <FeaturedServicesSidebar />
              <ProductCategoriesSidebar showAllOption={true} />
              <FeaturedProjectsSidebar />
              <FeaturedNewsSidebar />
              <FeaturedRecruitmentSidebar />
              <OnlineSupportSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              {/* Header Box with Image and Info */}
              <div
                className={cn(
                  "rounded-lg p-6 mb-6 border shadow-sm",
                  theme === "dark"
                    ? "bg-navy-900 border-navy-700"
                    : "bg-white border-gray-100"
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gallery */}
                  <div>
                    <ProductGallery images={images} />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col">
                    <h1
                      className={cn(
                        "text-xl md:text-2xl font-bold mb-3",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}
                    >
                      {project.title}
                    </h1>

                    {project.shortDescription && (
                      <p
                        className={cn(
                          "text-sm md:text-base mb-4 leading-relaxed",
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        )}
                      >
                        {project.shortDescription}
                      </p>
                    )}

                    <div className="mt-auto">
                      <Link to="/contact">
                        <AppButton
                          label={t(
                            "projects.detail.ctaButton",
                            "Liên hệ tư vấn"
                          )}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Description */}
              {project.detailedDescription && (
                <div
                  className={cn(
                    "rounded-lg p-6 mb-6 border shadow-sm",
                    theme === "dark"
                      ? "bg-navy-900 border-navy-700"
                      : "bg-white border-gray-100"
                  )}
                >
                  <DetailedDescription
                    url={project.detailedDescription}
                    title={t("projects.detail.infoTitle", "Thông tin chi tiết")}
                  />
                </div>
              )}
              {/* Reviews Section */}
              <div
                className={cn(
                  "rounded-lg p-6 mb-6 border shadow-sm",
                  theme === "dark"
                    ? "bg-[#242830] border-[#2d3f5e]"
                    : "bg-white"
                )}
              >
                <ProjectReviews
                  projectId={project.id}
                  projectName={project.title}
                />
              </div>
              {/* CTA Section */}
              <Paper
                shadow="md"
                p="xl"
                radius="lg"
                className={cn(
                  "text-center",
                  theme === "dark"
                    ? "bg-[#242830] border-[#2d3f5e]"
                    : "bg-white"
                )}
              >
                <Title
                  order={3}
                  c={theme === "light" ? "black" : "white"}
                  mb="md"
                >
                  {t("projects.detail.ctaTitle", "Bạn quan tâm đến dự án này?")}
                </Title>
                <Text
                  c={theme === "light" ? "black" : "white"}
                  mb="lg"
                  opacity={0.9}
                >
                  {t(
                    "projects.detail.ctaDescription",
                    "Liên hệ ngay với chúng tôi để được tư vấn chi tiết về các dự án tương tự."
                  )}
                </Text>
                <Link to="/contact">
                  <AppButton
                    label={t("projects.detail.ctaButton", "Liên hệ ngay")}
                  />
                </Link>
              </Paper>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}
