import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Briefcase,
  FolderKanban,
  Users,
  Contact,
  Megaphone,
  MessageSquareQuote,
  RefreshCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import statisticsService, {
  DashboardStats,
} from "@/services/api/statisticsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await statisticsService.getDashboardStats();
      if (res) {
        setStats(res);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("common.error", "Có lỗi xảy ra khi tải dữ liệu"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statItems = [
    {
      title: t("dashboard.products", "Sản phẩm"),
      value: stats?.products || 0,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t("dashboard.services", "Dịch vụ"),
      value: stats?.services || 0,
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: t("dashboard.projects", "Dự án"),
      value: stats?.projects || 0,
      icon: FolderKanban,
      color: "from-orange-500 to-red-500",
    },
    {
      title: t("dashboard.news", "Tin tức"),
      value: stats?.news || 0,
      icon: Megaphone,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: t("dashboard.recruitment", "Tin tuyển dụng"),
      value: stats?.recruitments || 0,
      icon: Users,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: t("dashboard.quotes", "Yêu cầu báo giá"),
      value: stats?.quotes || 0,
      icon: MessageSquareQuote,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: t("dashboard.contacts", "Liên hệ"),
      value: stats?.contacts || 0,
      icon: Contact,
      color: "from-rose-500 to-pink-600",
    },
    {
      title: t("dashboard.users", "Người dùng"),
      value: stats?.users || 0,
      icon: Users,
      color: "from-gray-500 to-slate-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">{t("admin.dashboard.title")}</h1>
          <p className="text-muted-foreground">
            {t(
              "admin.dashboard.subtitle",
              "Tổng quan hệ thống quản trị nội dung website."
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={isLoading}
        >
          <RefreshCcw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          {t("common.refresh", "Làm mới")}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-transparent hover:border-t-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} shadow-sm`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  {/* Removed trend for now as we don't have historical comparison yet */}
                  {/* <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span>Active items</span>
                  </div> */}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
