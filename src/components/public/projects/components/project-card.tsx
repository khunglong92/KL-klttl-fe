import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppThumbnailImage } from "../../common/app-thumbnail-image";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Project } from "../hooks/use-projects-public";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full rounded-2xl overflow-hidden border border-border bg-card transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl"
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-muted">
        {project.images && project.images.length > 0 ? (
          <AppThumbnailImage
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <BadgeIcon className="w-12 h-12 text-amber-500/50" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500" />

        {/* Featured Badge */}
        {project.isFeatured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white">
              {t("projects.card.featured", "Nổi bật")}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2 text-foreground group-hover:text-amber-500 transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        {project.shortDescription && (
          <p className="text-sm md:text-base text-muted-foreground line-clamp-2 mb-4 grow">
            {project.shortDescription}
          </p>
        )}

        {/* View Details Button */}
        <Link
          to="/projects/$projectId"
          params={{ projectId: project.id }}
          className={cn(
            "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
            "bg-amber-500 hover:bg-amber-600 text-white font-medium",
            "transition-all duration-300 group/btn"
          )}
        >
          <span>{t("projects.card.viewDetails", "Xem chi tiết")}</span>
          <svg
            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
