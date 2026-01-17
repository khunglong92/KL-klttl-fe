import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/services/api/productsService";
import { ChevronRight } from "lucide-react";

export function SimpleProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const shouldShowPrice = product.showPrice && product.price;
  const priceDisplay = shouldShowPrice
    ? formatPrice(
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price || 0
      )
    : null;

  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="block h-full"
    >
      <div
        className={cn(
          "group relative rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-[360px]",
          theme === "dark"
            ? "bg-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10"
            : "bg-white border border-gray-100 shadow-lg hover:shadow-2xl"
        )}
      >
        {/* Image Area */}
        <div className="relative flex-1 w-full overflow-hidden">
          <AppThumbnailImage
            src={product.images?.[0]}
            alt={product.name}
            width="400"
            height="300"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Red Title Overlay - giống service card */}
          <div className="absolute bottom-0 left-0 right-0 bg-accent-red/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between transition-all duration-300 group-hover:py-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-blue-900 text-sm md:text-base font-bold uppercase line-clamp-2 leading-tight">
                {product.name}
              </h3>
              <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-10 group-hover:opacity-100 group-hover:mt-2">
                <span className="inline-flex items-center text-white text-[10px] md:text-xs font-bold uppercase tracking-wider border-b border-white pb-0.5">
                  {t("common.viewDetails")}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
            <ChevronRight className="text-white w-4 h-4 ml-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>

        {/* Bottom Content Section - Price */}
        <div className="h-16 p-3 flex items-center justify-center">
          <span
            className={cn(
              "font-bold text-base",
              theme === "dark" ? "text-amber-400" : "text-red-500"
            )}
          >
            {priceDisplay || t("products.card.noPrice", "Liên hệ")}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CompactProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const shouldShowPrice = product.showPrice && product.price;
  const priceDisplay = shouldShowPrice
    ? formatPrice(
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price || 0
      )
    : null;

  return (
    <Link to="/products/$id" params={{ id: product.id }} className="block">
      <div
        className={cn(
          "group flex gap-3 p-3 rounded-lg overflow-hidden transition-all duration-300 border",
          theme === "dark"
            ? "bg-white/10 backdrop-blur-md border-white/10 shadow-md hover:shadow-lg"
            : "bg-white border-gray-100 shadow hover:shadow-lg"
        )}
      >
        <div
          className={cn(
            "w-16 h-16 shrink-0 rounded-lg overflow-hidden",
            theme === "dark" ? "bg-[#0f172a]" : "bg-gray-50"
          )}
        >
          <AppThumbnailImage
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h3
            className={cn(
              "text-sm font-bold line-clamp-1 transition-colors",
              theme === "dark"
                ? "text-gray-100 group-hover:text-amber-400"
                : "text-gray-900 group-hover:text-red-500"
            )}
          >
            {product.name}
          </h3>
          <span
            className={cn(
              "font-bold text-xs mt-1",
              theme === "dark" ? "text-amber-400" : "text-red-500"
            )}
          >
            {priceDisplay || t("products.card.noPrice", "Liên hệ")}
          </span>
        </div>
      </div>
    </Link>
  );
}
