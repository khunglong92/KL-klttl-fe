import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { cn, formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: {
    id?: string;
    name: string;
    category?: { name: string; id?: number };
    price?: string | number | null;
    showPrice?: boolean;
    description?: string;
    isFeatured?: boolean;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Parse description as bullet points (lines or array)
  const descriptionLines = product.description
    ? product.description.split("\n").filter((line) => line.trim())
    : [];

  // Price display logic
  const shouldShowPrice = product.showPrice && product.price;
  const priceDisplay = shouldShowPrice
    ? formatPrice(
        typeof product.price === "string"
          ? parseFloat(product.price)
          : product.price || 0
      )
    : t("products.card.noPrice", "Liên hệ");

  return (
    <div className="space-y-4">
      {/* Product Title */}
      <h2
        className={cn(
          "text-2xl font-bold uppercase",
          theme === "dark" ? "text-white" : "text-gray-900"
        )}
      >
        {product.name}
      </h2>

      {/* Separator Line */}
      <hr
        className={cn(
          "border-t",
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        )}
      />

      {/* Price line: "Giá sản phẩm: [price]" */}
      <div>
        <span
          className={cn(
            "text-base",
            theme === "dark" ? "text-gray-400" : "text-gray-700"
          )}
        >
          {t("productDetail.price.label", "Giá sản phẩm")}:{" "}
        </span>
        <span className="text-red-500 font-bold text-lg">{priceDisplay}</span>
      </div>

      {/* Description as Bullet Points */}
      {descriptionLines.length > 0 && (
        <ul
          className={cn(
            "list-disc list-inside space-y-1.5",
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          )}
        >
          {descriptionLines.map((line, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
