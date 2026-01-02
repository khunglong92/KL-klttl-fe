import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { priceQuotesService } from "@/services/api/priceQuotesService";
import { PageLayout } from "@/components/layout/PageLayout";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { useTranslation } from "react-i18next";
import { Loader2, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PriceQuoteSectionContent } from "@/components/public/price-quote/components/price-quotes-section-content";

export default function PriceQuoteDetailPage() {
  const { priceQuoteId } = useParams({ from: "/quote/$priceQuoteId" });
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { data: quote, isLoading } = useQuery({
    queryKey: ["price-quote-detail", priceQuoteId],
    queryFn: () => priceQuotesService.getOne(priceQuoteId),
    enabled: !!priceQuoteId,
  });

  if (isLoading) {
    return (
      <PageLayout
        seo={{ title: "Loading...", description: "" }}
        breadcrumbs={<>...</>}
        sidebar={<></>}
      >
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      </PageLayout>
    );
  }

  if (!quote) {
    return (
      <PageLayout
        seo={{ title: "Not Found", description: "" }}
        breadcrumbs={<>Not Found</>}
        sidebar={<></>}
      >
        <div className="text-center py-10">
          {t("common.notFound", "Không tìm thấy nội dung")}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      seo={{
        title: quote.title,
        description: quote.subtitle || quote.title,
      }}
      breadcrumbs={
        <>
          <Link to="/quote" className="hover:text-primary transition-colors">
            {t("nav.priceQuotes", "Báo giá")}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground truncate max-w-[200px]">
            {quote.title}
          </span>
        </>
      }
      sidebar={
        <>
          <FeaturedNewsSidebar />
          <OnlineSupportSidebar />
        </>
      }
    >
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-4 border-b pb-6 dark:border-gray-800">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight bg-linear-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            {quote.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {quote.createdAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time>
                  {format(new Date(quote.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>Admin</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {quote.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <img
              src={quote.image}
              alt={quote.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Subtitle/Intro */}
        {quote.subtitle && (
          <div
            className={cn(
              "p-6 rounded-lg border-l-4 border-amber-500 italic text-lg leading-relaxed",
              theme === "dark" ? "bg-amber-500/10" : "bg-amber-50"
            )}
          >
            {quote.subtitle}
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-12">
          {quote.contentSections?.map((section, idx) => (
            <div key={idx} className="space-y-6">
              {section.title && (
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-amber-500 rounded-full"></span>
                  {section.title}
                </h2>
              )}

              {/* Description (Rich Text) */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <PriceQuoteSectionContent contentKey={section.description} />
              </div>
            </div>
          ))}
        </div>
      </motion.article>
    </PageLayout>
  );
}
