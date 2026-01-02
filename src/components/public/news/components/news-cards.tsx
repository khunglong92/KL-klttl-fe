import { Link } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface News {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  createdAt?: string;
}

interface NewsCardProps {
  news: News;
  baseUrl?: string;
  paramKey?: string;
}

export function SimpleNewsCard({
  news,
  baseUrl = "/news",
  paramKey = "newsId",
}: NewsCardProps) {
  const { theme } = useTheme();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Link
      to={`${baseUrl}/$${paramKey}` as "/news/$newsId"}
      params={{ [paramKey]: news.id } as { newsId: string }}
      className="block h-full"
    >
      <motion.div
        whileHover={{ y: -4 }}
        className={cn(
          "group h-full flex flex-col relative rounded-xl overflow-hidden border transition-all duration-300",
          theme === "dark"
            ? "bg-[#24262b] border-[#2d3f5e] hover:border-amber-500/50"
            : "bg-white border-gray-100 hover:border-amber-500/50 hover:shadow-lg"
        )}
      >
        {/* Image */}
        <div className="relative aspect-16/10 overflow-hidden shrink-0">
          {news.image ? (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center",
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              )}
            >
              <span className="text-4xl">📰</span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3
            className={cn(
              "font-bold text-base line-clamp-2 mb-2 group-hover:text-amber-500 transition-colors",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}
          >
            {news.title}
          </h3>
          {news.subtitle && (
            <p
              className={cn(
                "text-sm line-clamp-2 mb-3",
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              )}
            >
              {news.subtitle}
            </p>
          )}
          {news.createdAt && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(news.createdAt)}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export function CompactNewsCard({
  news,
  baseUrl = "/news",
  paramKey = "newsId",
}: NewsCardProps) {
  const { theme } = useTheme();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Link
      to={`${baseUrl}/$${paramKey}` as "/news/$newsId"}
      params={{ [paramKey]: news.id } as { newsId: string }}
    >
      <motion.div
        whileHover={{ x: 4 }}
        className={cn(
          "group flex gap-4 p-3 rounded-lg border transition-all duration-300",
          theme === "dark"
            ? "bg-[#24262b] border-[#2d3f5e] hover:border-amber-500/50"
            : "bg-white border-gray-100 hover:border-amber-500/50 hover:shadow-md"
        )}
      >
        {/* Thumbnail */}
        <div className="w-24 h-20 shrink-0 rounded-lg overflow-hidden">
          {news.image ? (
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex items-center justify-center",
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              )}
            >
              <span className="text-2xl">📰</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-bold text-sm line-clamp-2 group-hover:text-amber-500 transition-colors",
              theme === "dark" ? "text-white" : "text-gray-800"
            )}
          >
            {news.title}
          </h3>
          {news.createdAt && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(news.createdAt)}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
