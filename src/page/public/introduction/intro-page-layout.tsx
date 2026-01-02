import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";
import { SEO } from "@/components/public/common/SEO";

import { FeaturedServicesSidebar } from "@/components/public/introduction/sidebar/featured-services-sidebar";
// ... (rest of imports)
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { ProductCategoriesSidebar } from "@/components/public/introduction/sidebar/product-categories-sidebar";
import { IntroSubNav } from "@/components/public/introduction/sub-nav";

interface IntroPageLayoutProps {
  titleKey: string;
  contentKey?: string;
  children?: React.ReactNode;
}

export default function IntroPageLayout({
  titleKey,
  contentKey,
  children,
}: IntroPageLayoutProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-navy-950" : "bg-[#f8f9fa]"}`}
    >
      <SEO
        title={t(titleKey)}
        description={contentKey ? t(contentKey).substring(0, 160) : undefined}
      />

      {/* Breadcrumbs */}
      <div
        className={`border-b py-3 ${theme === "dark" ? "bg-navy-900 border-navy-700" : "bg-gray-100/80 border-gray-200"}`}
      >
        <div className="container mx-auto px-4">
          <div
            className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-[#CF0927]" : "text-gray-600"}`}
          >
            <Link to="/" className="transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span> {t("nav.home") || "Trang chủ"}</span>
            </Link>
            <p> » </p>
            <Link to="/introduction" className="transition-colors">
              {t("nav.introduction") || "Giới thiệu"}
            </Link>
            <p> » </p>
            <span className="font-medium">{t(titleKey)}</span>
          </div>
        </div>
      </div>

      <IntroSubNav />

      {/* Content Section */}
      <section className="py-10 md:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 min-w-0"
            >
              <div
                className={`p-6 md:p-10 rounded-xl shadow-sm border ${
                  theme === "dark"
                    ? "bg-[#242830] border-[#242830]"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="font-extrabold text-3xl text-red-500 pb-8 text-center">
                  {t(titleKey)}
                </div>
                <div className="prose prose-lg max-w-none">
                  {contentKey && (
                    <p
                      className={`leading-relaxed whitespace-pre-line mb-8 text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}
                    >
                      {t(contentKey)}
                    </p>
                  )}
                  {children}
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[320px] shrink-0">
              <FeaturedServicesSidebar />
              <OnlineSupportSidebar />
              <ProductCategoriesSidebar />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
