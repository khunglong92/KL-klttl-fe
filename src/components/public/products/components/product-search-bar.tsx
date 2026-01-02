import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Search, LayoutGrid, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "compact";
  onViewModeChange: (mode: "grid" | "compact") => void;
  totalShowing: number;
  totalProducts: number;
}

export function ProductSearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalShowing,
  totalProducts,
}: ProductSearchBarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "p-4 rounded-lg shadow-sm border mb-4",
        theme === "dark"
          ? "bg-[#242830] border-[#2d3f5e]"
          : "bg-white border-gray-100"
      )}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t(
              "products.filter.searchPlaceholder",
              "Tìm kiếm theo tên sản phẩm..."
            )}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50",
              theme === "dark"
                ? "bg-navy-800 border-navy-700 text-white placeholder:text-gray-500"
                : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
            )}
          />
        </div>

        {/* View Mode Toggle */}
        <div
          className={cn(
            "flex items-center gap-1 p-1 rounded-lg",
            theme === "dark" ? "bg-navy-800" : "bg-gray-100"
          )}
        >
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "grid"
                ? "bg-amber-500 text-white shadow-sm"
                : theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
            )}
            title={t("products.filter.grid", "Lưới")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("compact")}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === "compact"
                ? "bg-amber-500 text-white shadow-sm"
                : theme === "dark"
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900"
            )}
            title={t("products.filter.compact", "Gọn")}
          >
            <Rows3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div
        className={cn(
          "mt-3 text-xs",
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        )}
      >
        {t("products.filter.showing", "Hiển thị")}{" "}
        <span className="font-semibold">{totalShowing}</span> /{" "}
        <span className="font-semibold">{totalProducts}</span>{" "}
        {t("products.filter.products", "sản phẩm")}
      </div>
    </div>
  );
}
