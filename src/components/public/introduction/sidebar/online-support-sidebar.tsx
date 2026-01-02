import { Phone, Clock } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Ultils from "@/utils";

const PHONE_NUMBER = import.meta.env["VITE_PHONE_NUMBER"] || "0967853833";

export const OnlineSupportSidebar = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const waveVisible = {
    animate: {
      scale: [1, 1.45],
      opacity: [0.35, 0],
    },
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeOut",
    },
  };

  const iconPulse = {
    animate: {
      scale: [1, 1.12, 1],
    },
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

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
        <div className="relative w-24 h-24 mb-2">
          <div className="absolute inset-0 bg-accent-red/10 animate-ping rounded-full" />
          <div
            className={`relative p-3 rounded-full border shadow-sm ${
              theme === "dark"
                ? "bg-[#1a2742] border-accent-red/20"
                : "bg-white border-accent-red/20"
            }`}
          >
            <a href={`tel:${PHONE_NUMBER}`}>
              <div className="relative flex items-center justify-center">
                {/* Wave */}
                <motion.span
                  {...waveVisible}
                  className="absolute inset-0 rounded-full bg-red-500/40"
                />

                {/* Icon */}
                <motion.span
                  {...iconPulse}
                  className="relative z-10 p-2.5 rounded-full text-green-600"
                >
                  <Phone className="h-12 w-12" />
                </motion.span>
              </div>
            </a>
          </div>
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
            className={`text-2xl ${theme === "dark" ? "text-white" : "text-black"} font-bold hover:scale-105 transition-transform inline-block`}
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
