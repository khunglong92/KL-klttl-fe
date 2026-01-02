import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/base";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Newspaper } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

interface News {
  id: string;
  title: string;
  image?: string;
}

export const FeaturedNewsSidebar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { data: news } = useQuery({
    queryKey: ["featured-news"],
    queryFn: async () => {
      const response = await apiClient.get<News[]>("/news/featured?limit=5");
      return response || [];
    },
  });

  // if (!news || news.length === 0) return null; // Let it render empty state

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
          <Newspaper className="w-4 h-4 text-white" />
          <h3 className="text-white font-black uppercase text-sm tracking-widest">
            {t("sidebar.featured_news", "Tin nổi bật")}
          </h3>
        </div>
      </div>
      <div className={theme === "dark" ? "bg-[#24262b]" : "bg-white"}>
        {news && news.length > 0 ? (
          news.map((item) => (
            <Link
              key={item.id}
              to="/news/$newsId"
              params={{ newsId: item.id }}
              className={`flex items-center gap-3 px-4 py-3 border-b transition-colors group ${
                theme === "dark"
                  ? "border-[#2d3f5e] hover:bg-[#2d3f5e]"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <span className="text-xl">📰</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-bold line-clamp-2 ${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          ))
        ) : (
          <div
            className={`p-4 text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            {t("common.updating", "Đang cập nhật")}
          </div>
        )}
      </div>
    </div>
  );
};
