import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Briefcase,
  FolderKanban,
  Users,
  BarChart3,
  ChevronLeft,
  Mail,
  Contact,
  ImageIcon,
  Newspaper,
  UserPlus,
  ScrollText,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { useTranslation } from "react-i18next";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Divider } from "@mantine/core";

export function AdminSidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Xác định trang hiện tại từ route path
  const currentPath = routerState.location.pathname || "";
  const currentPage = currentPath.split("/").pop() || "dashboard";

  const menuItems = [
    {
      id: "dashboard",
      route: "/admin/dashboard",
      name: t("admin.sidebar.dashboard"),
      icon: LayoutDashboard,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "company-intros",
      route: "/admin/company-intros",
      name: t("admin.sidebar.companyIntros"),
      icon: ImageIcon,
      color: "from-orange-500 to-orange-700",
    },
    {
      id: "products",
      route: "/admin/products",
      name: t("admin.sidebar.products"),
      icon: Package,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "categories",
      route: "/admin/categories",
      name: t("admin.sidebar.categories"),
      icon: Package,
      color: "from-teal-500 to-emerald-600",
    },
    {
      id: "services",
      route: "/admin/services",
      name: t("admin.sidebar.services"),
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "projects",
      route: "/admin/projects",
      name: t("admin.sidebar.projects"),
      icon: FolderKanban,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "news",
      route: "/admin/news",
      name: t("admin.sidebar.news"),
      icon: Newspaper,
      color: "from-indigo-500 to-blue-600",
    },
    {
      id: "recruitment",
      route: "/admin/recruitment",
      name: t("admin.sidebar.recruitment"),
      icon: UserPlus,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "contact",
      route: "/admin/contact",
      name: t("admin.sidebar.contact"),
      icon: Mail,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "contact-us",
      route: "/admin/contact-us",
      name: t("admin.sidebar.contactUsManager"),
      icon: Contact,
      color: "from-orange-600 to-red-800",
    },
    {
      id: "quotes",
      route: "/admin/quotes",
      name: t("admin.sidebar.priceQuotes", "Báo giá"),
      icon: ScrollText,
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "users",
      route: "/admin/users",
      name: t("admin.sidebar.users"),
      icon: Users,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "reviews",
      route: "/admin/reviews",
      name: t("admin.sidebar.reviews", "Nhận xét"),
      icon: MessageSquare,
      color: "from-rose-500 to-pink-600",
    },
    {
      id: "statistics",
      route: "/admin/statistics",
      name: t("admin.sidebar.statistics"),
      icon: BarChart3,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const handleNavigate = (route: string) => {
    navigate({ to: route as any });
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card min-h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72",
        theme === "dark" ? "bg-white text-black" : "bg-[#2a2931] text-white"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute rounded-full ${theme === "dark" ? "bg-white/10" : "bg-black/60"} backdrop-blur-sm hover:bg-opacity-50 cursor-pointer top-2 -right-12 shadow-2xl duration-1000 shadow-indigo-300 z-10 h-10 w-10 bg-card text-card-foreground flex items-center justify-center hover:bg-accent transition-colors`}
      >
        <ChevronLeft
          className={cn(
            "h-6 w-6 transition-discrete text-white duration-300 ease-in-out",
            isCollapsed && "rotate-180"
          )}
        />
      </button>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <div key={item.id} className="hover:opacity-50">
              <motion.button
                title={isCollapsed ? item.name : ""}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleNavigate(item.route)}
                className={cn(
                  "w-full flex items-center cursor-pointer hover:opacity-50 gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-linear-to-r " + item.color + " text-white shadow-lg"
                    : "hover:bg-accent",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-bold!">{item.name}</span>
                )}
              </motion.button>
              {!isActive && <Divider />}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
