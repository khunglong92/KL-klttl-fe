import { Link } from "@tanstack/react-router";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import { Project } from "@/components/public/projects/hooks/use-projects-public";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function SimpleProjectCard({ project }: ProjectCardProps) {
  const { theme } = useTheme();
  // Ensure images is an array and take the first one
  const images = Array.isArray(project.images) ? project.images : [];
  const imageUrl = images.length > 0 ? images[0] : "";

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group block h-full"
    >
      <div
        className={cn(
          "h-full flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border",
          theme === "dark"
            ? "bg-navy-900 border-navy-800 hover:border-amber-500/50"
            : "bg-white border-gray-100 hover:border-amber-200"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-navy-800">
          {project.isFeatured && (
            <div className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold text-white bg-amber-500 rounded-md shadow-sm">
              Featured
            </div>
          )}
          <AppThumbnailImage
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category Badge */}

          <h3
            className={cn(
              "font-bold text-lg mb-2 line-clamp-2 group-hover:text-amber-500 transition-colors",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "text-sm mb-4 line-clamp-3",
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {project.shortDescription}
          </p>

          <div className="mt-auto pt-3 border-t border-dashed border-gray-200 dark:border-navy-700 flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                theme === "dark" ? "text-amber-400" : "text-amber-600"
              )}
            >
              Xem chi tiết{" "}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CompactProjectCard({ project }: ProjectCardProps) {
  const { theme } = useTheme();
  // Ensure images is an array
  const images = Array.isArray(project.images) ? project.images : [];
  const imageUrl = images.length > 0 ? images[0] : "";

  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group block"
    >
      <div
        className={cn(
          "flex rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md border",
          theme === "dark"
            ? "bg-navy-900 border-navy-800 hover:border-amber-500/30"
            : "bg-white border-gray-100 hover:border-amber-200"
        )}
      >
        <div className="w-1/3 max-w-[120px] aspect-square relative bg-gray-100 dark:bg-navy-800">
          <AppThumbnailImage
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 p-3 flex flex-col justify-center">
          <h3
            className={cn(
              "font-bold text-base mb-1 line-clamp-1 group-hover:text-amber-500 transition-colors",
              theme === "dark" ? "text-white" : "text-gray-900"
            )}
          >
            {project.title}
          </h3>
          <p
            className={cn(
              "text-xs line-clamp-2 mb-2",
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            )}
          >
            {project.shortDescription}
          </p>
        </div>
      </div>
    </Link>
  );
}
