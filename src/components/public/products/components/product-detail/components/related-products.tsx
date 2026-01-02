import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import { useRelatedProducts } from "../../../hooks/use-related-products";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import { cn, formatPrice } from "@/lib/utils";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/services/api/productsService";

interface RelatedProductsProps {
  categoryId?: number;
  currentProductId?: string;
}

// Simple card matching products list page
function SimpleProductCard({ product }: { product: Product }) {
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
          "group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border flex flex-col h-[300px]",
          theme === "dark"
            ? "bg-navy-900 border-navy-700"
            : "bg-white border-gray-100"
        )}
      >
        {/* Image Area */}
        <div className="h-[60%] w-full overflow-hidden bg-gray-50 relative">
          <AppThumbnailImage
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        {/* Content Area */}
        <div
          className={cn(
            "flex-1 p-3 flex flex-col justify-between",
            theme === "dark" ? "bg-navy-900" : "bg-white"
          )}
        >
          <h3
            className={cn(
              "text-sm font-bold text-center line-clamp-2 transition-colors",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="pt-2 text-center">
            <span className="text-red-500 font-bold text-sm">
              {priceDisplay || t("products.card.noPrice", "Liên hệ")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { products, loading } = useRelatedProducts(
    categoryId,
    currentProductId
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div>
        <h3
          className={cn(
            "text-xl font-bold mb-4",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}
        >
          {t("productDetail.relatedProducts.title", "Sản phẩm liên quan")}
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h3
        className={cn(
          "text-xl font-bold mb-4",
          theme === "dark" ? "text-white" : "text-gray-900"
        )}
      >
        {t("productDetail.relatedProducts.title", "Sản phẩm liên quan")}
      </h3>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 translate-y-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110",
          theme === "dark"
            ? "bg-navy-800 text-white border border-navy-600"
            : "bg-white text-gray-700 border border-gray-200"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 translate-y-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110",
          theme === "dark"
            ? "bg-navy-800 text-white border border-navy-600"
            : "bg-white text-gray-700 border border-gray-200"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-[220px]">
            <SimpleProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
