import { Link } from "@tanstack/react-router";
import { ChevronRight, Users } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useFeaturedRecruitment } from "@/services/hooks/useRecruitment";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FeaturedRecruitmentSidebar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data: recruitmentData } = useFeaturedRecruitment(5);

  const recruitment = recruitmentData || [];

  // if (!recruitment || recruitment.length === 0) return null;

  return (
    <div
      className={`border shadow-sm rounded-lg overflow-hidden mb-6 ${
        theme === "dark"
          ? "bg-[#24262b] border-[#2d3f5e]"
          : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`px-4 py-3 ${theme === "dark" ? "bg-[#6b4423]" : "bg-amber-600"}`}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-white" />
          <h3 className="text-white font-black uppercase text-sm tracking-widest">
            {t("sidebar.recruitment", "Tuyển dụng")}
          </h3>
        </div>
      </div>
      <div className={theme === "dark" ? "bg-[#24262b]" : "bg-white"}>
        {recruitment && recruitment.length > 0 ? (
          recruitment.map((item) => (
            <Link
              key={item.id}
              to="/recruitment/$recruitmentId"
              params={{ recruitmentId: item.id }}
              className={`flex items-center gap-3 px-4 py-3 border-b transition-colors group ${
                theme === "dark"
                  ? "border-[#2d3f5e] hover:bg-[#2d3f5e]"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full shrink-0 ${
                  theme === "dark" ? "bg-amber-900/30" : "bg-amber-100"
                }`}
              >
                <Users
                  className={`w-5 h-5 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-bold line-clamp-2 ${
                    theme === "dark" ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.title}
                </span>
                {item.subtitle && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`text-xs line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                      >
                        📍 {item.subtitle}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className={
                        theme === "dark"
                          ? "bg-white text-black border-gray-200"
                          : "bg-black text-white border-transparent"
                      }
                    >
                      <p className="max-w-[300px] wrap-break-word">
                        {item.subtitle}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all shrink-0" />
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
