import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import {
  servicesService,
  CompanyService,
} from "@/services/api/servicesService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { DetailedDescription } from "./detailed-description";
import { ServiceReviews } from "./service-reviews";
import { ServiceCTA } from "./services-cta";
import { Text, Paper, Stack, Loader, Title } from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { ProductCategoriesSidebar } from "@/components/public/introduction/sidebar/product-categories-sidebar";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { FeaturedRecruitmentSidebar } from "@/components/public/introduction/sidebar/featured-recruitment-sidebar";
import { ProductGallery } from "@/components/public/products/components/product-detail/components/product-gallery";
import { FeaturedServicesSidebar } from "@/components/public/introduction/sidebar/featured-services-sidebar";

export default function ServiceDetailComponent() {
  const { id } = useParams({ from: "/services/$id" });
  const { t } = useTranslation();
  const [service, setService] = useState<CompanyService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(new Error("Service ID is missing."));
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.findOne(id);
        setService(response);
      } catch (err) {
        const fetchError =
          err instanceof Error
            ? err
            : new Error("Failed to load service details.");
        setError(fetchError);
        toast.error(t("serviceDetail.toast.loadError"));
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchService();
  }, [id, t]);

  if (loading) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Loader size="xl" />
        <Text>Loading service details...</Text>
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
          <Text>{error.message || "Failed to load service details."}</Text>
        </Paper>
      </Stack>
    );
  }

  if (!service) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Text>Service not found.</Text>
      </Stack>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen",
        theme === "dark" ? "bg-navy-950" : "bg-[#f8f9fa]"
      )}
    >
      {/* Breadcrumb - Matching Product Page Style */}
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
            <Link to="/services" className="hover:opacity-80">
              {t("nav.services", "Dịch vụ")}
            </Link>
            <span>»</span>
            <span
              className={cn(
                "font-medium line-clamp-1 max-w-[200px]",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              {service.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content with Sidebar - Same structure as Product page */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0 space-y-4 order-2 lg:order-1">
              <FeaturedServicesSidebar />
              <ProductCategoriesSidebar showAllOption={true} />
              <FeaturedNewsSidebar />
              <FeaturedRecruitmentSidebar />
              <OnlineSupportSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              {/* Service Header with Gallery & Info */}
              <div
                className={cn(
                  "rounded-lg p-6 mb-6 border shadow-sm",
                  theme === "dark"
                    ? "bg-navy-900 border-navy-700"
                    : "bg-white border-gray-100"
                )}
              >
                {/* Gallery & Info Grid - Similar to Product Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Images Gallery */}
                  {service.images && service.images.length > 0 && (
                    <div className="w-full">
                      <ProductGallery images={service.images} />
                    </div>
                  )}

                  {/* Service Info */}
                  <div className="flex flex-col">
                    <h1
                      className={cn(
                        "text-xl md:text-2xl font-bold mb-3",
                        theme === "dark" ? "text-white" : "text-gray-900"
                      )}
                    >
                      {service.name}
                    </h1>

                    {/* Short Description */}
                    {service.shortDescription && (
                      <p
                        className={cn(
                          "text-sm md:text-base mb-4 leading-relaxed",
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        )}
                      >
                        {service.shortDescription}
                      </p>
                    )}

                    {/* Hash tags */}
                    {service.hashtags && service.hashtags.length > 0 && (
                      <div className="mt-auto pt-4">
                        <h3
                          className={cn(
                            "text-sm font-semibold mb-2",
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                                theme === "dark"
                                  ? "bg-navy-800 text-gray-300 border border-navy-700 hover:border-amber-500"
                                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-amber-400"
                              )}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Description - Fetched from URL */}
              {service.detailedDescription && (
                <div
                  className={cn(
                    "rounded-lg p-6 mb-6 border shadow-sm",
                    theme === "dark"
                      ? "bg-navy-900 border-navy-700"
                      : "bg-white border-gray-100"
                  )}
                >
                  <DetailedDescription
                    url={service.detailedDescription}
                    title={t("serviceDetail.detailed.title", "Mô tả chi tiết")}
                  />
                </div>
              )}

              {/* Reviews Section */}
              <div
                className={cn(
                  "rounded-lg p-6 mb-6 border shadow-sm",
                  theme === "dark"
                    ? "bg-navy-900 border-navy-700"
                    : "bg-white border-gray-100"
                )}
              >
                <ServiceReviews
                  serviceId={service.id}
                  serviceName={service.name}
                />
              </div>

              {/* CTA Section */}
              <div
                className={cn(
                  "rounded-lg p-6 border shadow-sm",
                  theme === "dark"
                    ? "bg-navy-900 border-navy-700"
                    : "bg-white border-gray-100"
                )}
              >
                <ServiceCTA
                  ctaLabel={"Liên hệ tư vấn"}
                  ctaLink={"/contact"}
                  title={service.name}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
