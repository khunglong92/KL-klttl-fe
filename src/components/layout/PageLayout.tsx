import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { SEO } from "@/components/public/common/SEO";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { FeaturedRecruitmentSidebar } from "@/components/public/introduction/sidebar/featured-recruitment-sidebar";

interface PageLayoutProps {
  seo?: {
    title: string;
    description: string;
  };
  breadcrumbs: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}

export function PageLayout({
  seo,
  breadcrumbs,
  sidebar,
  children,
}: PageLayoutProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen",
        theme === "dark" ? "bg-navy-950" : "bg-[#f8f9fa]"
      )}
    >
      {seo && <SEO title={seo.title} description={seo.description} />}

      {/* Breadcrumbs */}
      <div
        className={cn(
          "border-b py-3",
          theme === "dark"
            ? "bg-navy-900 border-navy-700"
            : "bg-gray-100/80 border-gray-200"
        )}
      >
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              theme === "light" ? "text-[#CF0927]" : "text-gray-600"
            )}
          >
            <Link to="/" className="transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>{t("nav.home", "Trang chủ")}</span>
            </Link>
            <p>»</p>
            {breadcrumbs}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] shrink-0 space-y-4">
              {sidebar}
              <FeaturedNewsSidebar />
              <FeaturedRecruitmentSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
