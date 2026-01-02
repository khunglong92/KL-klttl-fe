import { useTheme } from "@/hooks/useTheme";
import { useProjects } from "@/services/hooks/useProjects";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FeaturedProjectsSidebar = () => {
  const { data } = useProjects(undefined, 1, 5, true);
  const projects = data?.data || [];
  const { theme } = useTheme();
  const { t } = useTranslation();
  // Take only first 5 featured projects
  const featuredProjects = projects.slice(0, 5);

  return (
    <div
      className={`border shadow-sm rounded-lg overflow-hidden mb-6 ${
        theme === "dark"
          ? "bg-[#242830] border-[#2d3f5e]"
          : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`px-4 py-3 ${theme === "dark" ? "bg-[#23396c]" : "bg-[#2980B9]"}`}
      >
        <h3 className="text-white font-black uppercase text-sm tracking-widest">
          {t("sidebar.featured_projects") || "Dự án nổi bật"}
        </h3>
      </div>
      <div
        className={`divide-y ${theme === "dark" ? "divide-[#2d3f5e]" : "divide-gray-100"}`}
      >
        {featuredProjects.length > 0 ? (
          featuredProjects.map((project) => (
            <Link
              key={project.id}
              to="/projects/$projectId"
              params={{ projectId: project.id }}
              className={`flex items-center gap-2 px-4 py-3 transition-colors group ${
                theme === "dark" ? "hover:bg-[#2d3f5e]" : "hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-4 h-4 text-accent-red group-hover:translate-x-1 transition-transform" />
              <span
                className={`text-base font-bold line-clamp-1 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {project.title}
              </span>
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
