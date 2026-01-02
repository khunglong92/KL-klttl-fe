import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";

export const IntroSubNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme } = useTheme();

  const navItems = [
    {
      to: "/introduction",
      label: t("introduction_pages.general.title") || "Giới thiệu chung",
    },
    {
      to: "/introduction/company-profile",
      label: t("introduction_pages.profile.title") || "Hồ sơ năng lực",
    },
    {
      to: "/introduction/facilities",
      label: t("introduction_pages.facilities.title") || "Cơ sở vật chất",
    },
    {
      to: "/introduction/partners",
      label: t("introduction_pages.partners.title") || "Đối tác",
    },
    {
      to: "/introduction/privacy-policy",
      label: t("introduction_pages.privacy.title") || "Chính sách bảo mật",
    },
  ];

  return (
    <div
      className={cn(
        "border-b sticky top-0 z-10 shadow-sm",
        theme === "dark"
          ? "bg-navy-900 border-navy-700"
          : "bg-white border-gray-200"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-6 py-4 text-sm uppercase tracking-wide whitespace-nowrap transition-all border-b-2",
                  isActive
                    ? "text-accent-red border-accent-red font-black"
                    : cn(
                        "border-transparent hover:text-accent-red font-medium",
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      )
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
