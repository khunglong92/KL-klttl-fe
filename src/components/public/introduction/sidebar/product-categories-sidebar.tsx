import { useCategories } from "@/services/hooks/useCategories";
import { Link } from "@tanstack/react-router";
import { ChevronRight, FolderTree } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

export const ProductCategoriesSidebar = () => {
  const { data: categories } = useCategories();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={`border shadow-sm rounded-lg overflow-hidden mb-6 ${
        theme === "dark"
          ? "bg-[#24262b] border-[#2d3f5e]"
          : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`px-4 py-3 ${theme === "dark" ? "bg-[#23396c]" : "bg-[#2980B9]"}`}
      >
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-white" />
          <h3 className="text-white font-black uppercase text-sm tracking-widest">
            {t("sidebar.product_categories") || "Danh mục sản phẩm"}
          </h3>
        </div>
      </div>
      <div className={theme === "dark" ? "bg-[#24262b]" : "bg-white"}>
        {categories?.map((category) => (
          <Link
            key={category.id}
            to="/products"
            search={{ categoryId: category.id }}
            className={`flex items-center justify-between px-4 py-3 border-b transition-colors group ${
              theme === "dark"
                ? "border-[#2d3f5e] hover:bg-[#2d3f5e] text-white"
                : "border-gray-100 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="text-sm font-bold">{category.name}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent-red group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};
