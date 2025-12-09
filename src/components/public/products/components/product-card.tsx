import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { AppThumbnailImage } from "../../common/app-thumbnail-image";
import AppButton from "@/components/atoms/app-button";
import { cn, formatPrice } from "@/lib/utils";
import type { ProductCardProps } from "..";
import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "@tanstack/react-router";

interface ProductCardComponentProps extends ProductCardProps {
  variant?: "default" | "compact";
}

export function ProductCard({
  id,
  name,
  price,
  images,
  description,
  stock,
  className,
  variant = "default",
}: ProductCardComponentProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isCompact = variant === "compact";
  const router = useRouter();

  const descriptionText = (() => {
    if (!description) return "";
    if (typeof description === "string") {
      return description;
    }

    if (typeof description === "object") {
      const record = description as Record<string, unknown>;
      const overview = record["overview"];
      if (typeof overview === "string" && overview.trim().length > 0) {
        return overview;
      }

      const details = record["details"];
      if (typeof details === "string" && details.trim().length > 0) {
        return details;
      }

      const firstTextValue = Object.values(record).find(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );
      if (firstTextValue) {
        return firstTextValue;
      }
    }

    return "";
  })();

  const isAvailable = typeof stock === "number" ? stock > 0 : true;
  const statusLabel = t(
    isAvailable ? "products.card.available" : "products.card.unavailable"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className={cn("group h-full", className)}
    >
      <div
        className={cn(
          "relative flex h-[360px] flex-col overflow-hidden rounded-2xl transition-all duration-500",
          isDark
            ? "border border-white/10 bg-black/30 hover:shadow-[0_0_36px_rgba(245,158,11,0.35)]"
            : "border border-slate-200 bg-white/80 backdrop-blur-md hover:shadow-[0_0_32px_rgba(245,158,11,0.35)]"
        )}
      >
        <AppThumbnailImage
          src={images?.[0]}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.85]"
        />

        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(180deg, rgba(18,18,18,0.55) 0%, rgba(18,18,18,0.68) 45%, rgba(15,15,15,0.88) 100%)"
              : "linear-gradient(180deg, rgba(3,7,18,0.18) 0%, rgba(3,7,18,0.32) 45%, rgba(3,7,18,0.72) 100%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(251,191,36,0.35), transparent 50%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.3), transparent 45%)",
          }}
        />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between sm:left-5 sm:right-5">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-md",
              isAvailable ? "bg-emerald-500/90" : "bg-rose-500/90"
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div
          className={cn(
            "relative mt-auto flex flex-1 flex-col justify-end",
            isCompact ? "p-5" : "p-7"
          )}
        >
          <div className="absolute inset-0 bg-black/20 blur-2xl" aria-hidden />
          <div className="relative flex flex-col gap-3">
            <h3
              className={cn(
                "text-white transition-colors duration-300",
                isCompact
                  ? "text-base leading-tight line-clamp-2"
                  : "text-lg leading-snug line-clamp-2"
              )}
            >
              {name}
            </h3>

            {descriptionText && (
              <p
                className={cn(
                  "text-white/75",
                  isCompact
                    ? "text-[11px] leading-relaxed line-clamp-3"
                    : "text-sm leading-relaxed line-clamp-3"
                )}
              >
                {descriptionText}
              </p>
            )}

            <div className="flex items-center justify-between gap-4">
              <div>
                <span
                  className={cn(
                    "block uppercase tracking-wider text-white/65",
                    isCompact ? "text-[10px]" : "text-xs"
                  )}
                >
                  {t("products.card.priceLabel")}
                </span>
                <span
                  className={cn(
                    "font-semibold text-amber-300",
                    isCompact ? "text-xs" : "text-sm"
                  )}
                >
                  {price
                    ? formatPrice(price as number)
                    : t("products.card.noPrice")}
                </span>
              </div>
              <AppButton
                variant="default"
                size={isCompact ? "sm" : "default"}
                label={t("common.viewDetails")}
                onClick={() => {
                  router.navigate({
                    to: "/products/$id",
                    params: { id: id.toString() },
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
