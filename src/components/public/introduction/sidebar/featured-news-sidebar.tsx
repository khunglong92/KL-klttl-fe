import { useFeaturedProjects } from "@/services/hooks/useProjects";
import { Link } from "@tanstack/react-router";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";

export const FeaturedNewsSidebar = () => {
  const { data: featuredData } = useFeaturedProjects(1, 4);
  const projects = featuredData?.data || [];

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="bg-accent-red px-4 py-2">
        <h3 className="text-white font-bold uppercase text-sm">
          Tin tức nổi bật
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="flex gap-3 group"
          >
            <div className="w-20 h-16 shrink-0 rounded overflow-hidden">
              <AppThumbnailImage
                src={project.image || ""}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-accent-red transition-colors">
                {project.name}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
