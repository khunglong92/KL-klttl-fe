import { useTranslation } from "react-i18next";
import { Search, Grid3X3, List } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface NewsSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: "grid" | "compact";
  onViewModeChange: (mode: "grid" | "compact") => void;
  totalShowing: number;
  totalNews: number;
}

export function NewsSearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalShowing,
  totalNews,
}: NewsSearchBarProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between p-4 rounded-xl mb-6",
        theme === "dark"
          ? "bg-[#24262b] border border-[#2d3f5e]"
          : "bg-white border border-gray-100 shadow-sm"
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t("news.searchPlaceholder", "Tìm kiếm tin tức...")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors",
            theme === "dark"
              ? "bg-[#1a1c20] border-[#2d3f5e] text-white placeholder:text-gray-500 focus:border-amber-500"
              : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-amber-500"
          )}
        />
      </div>

      {/* Right Side: Count + View Toggle */}
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "text-sm",
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          )}
        >
          {t("news.showing", "Hiển thị")} {totalShowing}/{totalNews}
        </span>

        {/* View Mode Toggle */}
        <div
          className={cn(
            "flex rounded-lg overflow-hidden border",
            theme === "dark" ? "border-[#2d3f5e]" : "border-gray-200"
          )}
        >
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 transition-colors",
              viewMode === "grid"
                ? "bg-amber-500 text-white"
                : theme === "dark"
                  ? "bg-[#1a1c20] text-gray-400 hover:text-white"
                  : "bg-white text-gray-400 hover:text-gray-600"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("compact")}
            className={cn(
              "p-2 transition-colors",
              viewMode === "compact"
                ? "bg-amber-500 text-white"
                : theme === "dark"
                  ? "bg-[#1a1c20] text-gray-400 hover:text-white"
                  : "bg-white text-gray-400 hover:text-gray-600"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
