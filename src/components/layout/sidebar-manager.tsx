import {
  LayoutDashboard,
  Package,
  Tags,
  Briefcase,
  FolderKanban,
  Users,
  BarChart3,
  Mail,
  Contact,
  ImageIcon,
  Newspaper,
  UserPlus,
  ScrollText,
  MessageSquare,
  Layers,
  Contact2,
  ShieldCheck,
  Bot,
  Sparkles,
  KeyRound,
  ShieldAlert,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { useTranslation } from "react-i18next";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import companyLogo from "@/images/common/company-logo.png";

interface NavLeaf {
  id: string;
  route: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  items: NavLeaf[];
}

export function AdminSidebar() {
  const { t } = useTranslation();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname || "";

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    content: true,
    business: true,
    system: true,
    ai: true,
  });

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const groups: NavGroup[] = [
    {
      id: "content",
      label: t("admin.sidebar.groups.content"),
      icon: Layers,
      items: [
        {
          id: "company-intros",
          route: "/admin/company-intros",
          label: t("admin.sidebar.companyIntros"),
          icon: ImageIcon,
        },
        {
          id: "products",
          route: "/admin/products",
          label: t("admin.sidebar.products"),
          icon: Package,
        },
        {
          id: "categories",
          route: "/admin/categories",
          label: t("admin.sidebar.categories"),
          icon: Tags,
        },
        {
          id: "services",
          route: "/admin/services",
          label: t("admin.sidebar.services"),
          icon: Briefcase,
        },
        {
          id: "projects",
          route: "/admin/projects",
          label: t("admin.sidebar.projects"),
          icon: FolderKanban,
        },
        {
          id: "news",
          route: "/admin/news",
          label: t("admin.sidebar.news"),
          icon: Newspaper,
        },
        {
          id: "reviews",
          route: "/admin/reviews",
          label: t("admin.sidebar.reviews", "Nhận xét"),
          icon: MessageSquare,
        },
      ],
    },
    {
      id: "business",
      label: t("admin.sidebar.groups.business"),
      icon: Contact2,
      items: [
        {
          id: "recruitment",
          route: "/admin/recruitment",
          label: t("admin.sidebar.recruitment"),
          icon: UserPlus,
        },
        {
          id: "contact",
          route: "/admin/contact",
          label: t("admin.sidebar.contact"),
          icon: Mail,
        },
        {
          id: "contact-us",
          route: "/admin/contact-us",
          label: t("admin.sidebar.contactUsManager"),
          icon: Contact,
        },
        {
          id: "quotes",
          route: "/admin/quotes",
          label: t("admin.sidebar.priceQuotes", "Báo giá"),
          icon: ScrollText,
        },
      ],
    },
    {
      id: "system",
      label: t("admin.sidebar.groups.system"),
      icon: ShieldCheck,
      items: [
        {
          id: "users",
          route: "/admin/users",
          label: t("admin.sidebar.users"),
          icon: Users,
        },
        {
          id: "statistics",
          route: "/admin/statistics",
          label: t("admin.sidebar.statistics"),
          icon: BarChart3,
        },
      ],
    },
    {
      id: "ai",
      label: t("admin.sidebar.groups.ai"),
      icon: Bot,
      items: [
        {
          id: "ai-settings",
          route: "/admin/ai-settings",
          label: t("admin.sidebar.aiSettings"),
          icon: Sparkles,
        },
        {
          id: "ai-providers",
          route: "/admin/ai-providers",
          label: t("admin.sidebar.aiProviders"),
          icon: KeyRound,
        },
        {
          id: "ai-logs",
          route: "/admin/ai-logs",
          label: t("admin.sidebar.aiLogs"),
          icon: ShieldAlert,
        },
      ],
    },
  ];

  const isDashboardActive = currentPath === "/admin/dashboard";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Brand header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <img
          src={companyLogo}
          className="h-10 w-10 rounded-lg object-contain shadow-sm"
          alt=""
        />
        <div>
          <h1 className="text-lg font-bold leading-tight text-navy-600">
            {t("nav.companyName", "THIÊN LỘC")}
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <Link
          to="/admin/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg p-3 text-sm font-semibold transition-colors",
            isDashboardActive
              ? "bg-navy-600 font-bold text-white shadow-sm"
              : "text-foreground hover:bg-navy-50 hover:text-navy-600 dark:hover:bg-navy-950/40"
          )}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span>{t("admin.sidebar.dashboard")}</span>
        </Link>

        {groups.map((group, groupIndex) => {
          const GroupIcon = group.icon;
          const isGroupActive = group.items.some(
            (i) => currentPath === i.route
          );
          const isOpen = openGroups[group.id];

          return (
            <div key={group.id}>
              <div
                className={cn(
                  "px-3 pb-2 pt-6",
                  groupIndex === 0 && "pt-2"
                )}
              >
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/70">
                  {group.label}
                </p>
              </div>
              <details open={isOpen}>
                <summary
                  onClick={(e) => {
                    e.preventDefault();
                    toggleGroup(group.id);
                  }}
                  className={cn(
                    "flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-3 text-sm transition-colors",
                    isGroupActive
                      ? "bg-navy-600/10 font-bold text-navy-600"
                      : "font-semibold text-foreground hover:bg-navy-50 hover:text-navy-600 dark:hover:bg-navy-950/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <GroupIcon className="h-5 w-5 shrink-0" />
                    <span>{group.label}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                </summary>
                {isOpen && (
                  <div className="ml-5 mt-1 space-y-1 border-l-2 border-border pl-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPath === item.route;
                      return (
                        <Link
                          key={item.id}
                          to={item.route}
                          className={cn(
                            "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                            isActive
                              ? "bg-navy-600 font-bold text-white shadow-xs"
                              : "text-foreground hover:bg-navy-50 hover:text-navy-600 dark:hover:bg-navy-950/40"
                          )}
                        >
                          <Icon className="h-[18px] w-[18px] shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </details>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link
          to="/"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-navy-50 hover:text-navy-600"
        >
          <Home className="h-4 w-4 text-navy-600" />
          <span>{t("admin.sidebar.backToPublic", "Về trang chủ")}</span>
        </Link>
      </div>
    </aside>
  );
}
