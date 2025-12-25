import { useTheme } from "@/hooks/useTheme";
import { useFeaturedServices } from "@/services/hooks/useServices";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FeaturedServicesSidebar = () => {
  const { data } = useFeaturedServices(5);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const services = data?.pages.flatMap((page) => page.data) || [];

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
          {t("sidebar.featured_services") || "Dịch vụ nổi bật"}
        </h3>
      </div>
      <div
        className={`divide-y ${theme === "dark" ? "divide-[#2d3f5e]" : "divide-gray-100"}`}
      >
        {services.map((service) => (
          <Link
            key={service.id}
            to="/services/$slug"
            params={{ slug: service.slug }}
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
              {service.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
