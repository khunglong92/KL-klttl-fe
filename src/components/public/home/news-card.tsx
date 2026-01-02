import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

import type { News } from "@/services/api/newsService";
import { AppThumbnailImage } from "../common/app-thumbnail-image";

export interface NewsCardProps {
  news: Partial<News>;
  index?: number;
  className?: string;
}

export function NewsCard({ news, index = 0, className }: NewsCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  // Map backend fields to UI fields
  const id = news?.id;
  const title = news?.title;
  const subtitle = news?.subtitle;
  const image = news?.image;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        "group flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300",
        theme === "dark"
          ? "bg-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10"
          : "bg-white shadow-lg hover:shadow-xl",
        className
      )}
    >
      {/* Link Wrap for the entire card */}
      <Link
        to="/news/$newsId"
        params={{ newsId: id || "" }}
        className="flex flex-col h-full no-underline"
      >
        {/* Top Image Section */}
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <AppThumbnailImage
            src={image || "https://via.placeholder.com/400x300"}
            alt={title || "News Image"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Red Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-accent-red/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between transition-all duration-300 group-hover:py-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm md:text-base font-bold uppercase line-clamp-2 leading-tight">
                {title}
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

        {/* Bottom Content Section */}
        <div className="h-24 p-4">
          <p
            className={cn(
              "text-sm leading-relaxed line-clamp-2",
              theme === "dark" ? "text-gray-300" : "text-gray-800"
            )}
          >
            {subtitle || ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
