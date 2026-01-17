import { Phone, Clock } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import Ultils from "@/utils";

const PHONE_NUMBER = import.meta.env["VITE_PHONE_NUMBER"] || "0967853833";

export const OnlineSupportSidebar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
          {t("sidebar.online_support") || "Hỗ trợ trực tuyến"}
        </h3>
      </div>
      <div
        className={`p-4 flex flex-col items-center ${theme === "dark" ? "bg-[#242830]/50" : "bg-gray-50/50"}`}
      >
        <div className="mb-4 flex justify-center">
          <a href={`tel:${PHONE_NUMBER}`}>
            {/* Sidebar Ring Effect - Red */}
            <div className="hotline-sidebar-ring-wrap">
              <div className="hotline-sidebar-ring-circle"></div>
              <div className="hotline-sidebar-ring-circle-fill"></div>
              <div className="hotline-sidebar-ring-img-circle">
                <Phone className="h-7 w-7 text-white" />
              </div>
            </div>
          </a>
        </div>

        <div className="text-center">
          <p
            className={`text-xs font-bold uppercase mb-1 tracking-wider ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {t("sidebar.hotline") || "Hotline 24/7"}
          </p>
          <a
            href={`tel:${PHONE_NUMBER}`}
            className={`text-2xl ${theme === "dark" ? "text-red-500" : "text-red-600"} font-bold hover:scale-105 transition-transform inline-block`}
          >
            {Ultils.formatPhoneNumber(PHONE_NUMBER)}
          </a>
          <div
            className={`flex items-center justify-center gap-1 mt-2 text-xs ${
              theme === "dark" ? "text-gray-300" : "text-gray-500"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>
              {t("sidebar.service_hours") || "Phục vụ 24/7 (Cả ngày lễ)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
