import { motion } from "framer-motion";
import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

import { CompanyService } from "@/services/api/servicesService";
import AppButton from "@/components/atoms/app-button";
import { AppThumbnailImage } from "../common/app-thumbnail-image";

export interface ServiceCardProps {
  service: Partial<CompanyService>;
  index?: number;
  className?: string;
  variant?: "default" | "compact";
}

export function ServiceCard({
  service,
  index = 0,
  className,
  variant = "default",
}: ServiceCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isCompact = variant === "compact";
  const { title, subtitle, imageUrls, slug, id } = service || {};

  // Extract proper slug from slug field - if it's a full URL, use the ID instead
  const getServiceSlug = () => {
    if (slug && !slug.startsWith("http")) {
      return slug;
    }
    return id?.toString() || "";
  };

  const serviceSlug = getServiceSlug();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn("group h-full", className)}
    >
      <div
        className={cn(
          "relative flex h-[360px] flex-col overflow-hidden rounded-2xl transition-all duration-500",
          isDark
            ? "border border-white/10 bg-black/30 hover:shadow-[0_0_36px_rgba(59,130,246,0.35)]"
            : "border border-slate-200 bg-white/80 backdrop-blur-md hover:shadow-[0_0_32px_rgba(59,130,246,0.35)]"
        )}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <AppThumbnailImage
            src={imageUrls?.[0] || "https://via.placeholder.com/400"}
            alt={title || "Service Image"}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.85]"
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(180deg, rgba(18,18,18,0.55) 0%, rgba(18,18,18,0.68) 45%, rgba(15,15,15,0.88) 100%)"
              : "linear-gradient(180deg, rgba(3,7,18,0.18) 0%, rgba(3,7,18,0.32) 45%, rgba(3,7,18,0.72) 100%)",
          }}
        />

        {/* Hover Glow Effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.35), transparent 50%), radial-gradient(circle at 80% 10%, rgba(147,51,234,0.3), transparent 45%)",
          }}
        />

        {/* Service Status Badge */}
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between sm:left-5 sm:right-5">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-md",
              "bg-blue-500/90"
            )}
          >
            {t("services.card.available")}
          </span>
        </div>

        {/* Click Area - Top Section */}
        <Link
          to="/services/$slug"
          params={{ slug: serviceSlug }}
          className="absolute inset-0 z-10"
          aria-label={`View details for ${title}`}
        />

        {/* Content Section */}
        <div
          className={cn(
            "relative mt-auto flex flex-1 flex-col justify-end",
            isCompact ? "p-5" : "p-7"
          )}
        >
          <div className="absolute inset-0 bg-black/20 blur-2xl" aria-hidden />
          <div className="relative flex flex-col gap-3">
            {/* Service Title */}
            <h3
              className={cn(
                "text-white transition-colors duration-300",
                isCompact
                  ? "text-base leading-tight line-clamp-2"
                  : "text-lg leading-snug line-clamp-2"
              )}
            >
              {title}
            </h3>

            {/* Service Subtitle */}
            {subtitle && (
              <p
                className={cn(
                  "text-white/75",
                  isCompact
                    ? "text-[11px] leading-relaxed line-clamp-3"
                    : "text-sm leading-relaxed line-clamp-3"
                )}
              >
                {subtitle}
              </p>
            )}

            {/* Action Button */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span
                  className={cn(
                    "block uppercase tracking-wider text-white/65",
                    isCompact ? "text-[10px]" : "text-xs"
                  )}
                >
                  {t("services.card.serviceLabel")}
                </span>
                <span
                  className={cn(
                    "font-semibold text-blue-300",
                    isCompact ? "text-xs" : "text-sm"
                  )}
                >
                  {t("services.card.professional")}
                </span>
              </div>
              <AppButton
                variant="default"
                size={isCompact ? "sm" : "default"}
                label={t("common.viewDetails")}
                onClick={() => {
                  router.navigate({
                    to: "/services/$slug",
                    params: { slug: serviceSlug },
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
