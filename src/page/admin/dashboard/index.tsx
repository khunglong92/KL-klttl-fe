import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Briefcase,
  FolderKanban,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function AdminDashboard() {
  const { t } = useTranslation();
  const stats = [
    {
      title: t("admin.dashboard.title") + " • " + "Sản phẩm",
      value: "156",
      change: "+12%",
      isPositive: true,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Dịch vụ",
      value: "24",
      change: "+5%",
      isPositive: true,
      icon: Briefcase,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Dự án đang thực hiện",
      value: "45",
      change: "+8%",
      isPositive: true,
      icon: FolderKanban,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Người dùng",
      value: "2,847",
      change: "+23%",
      isPositive: true,
      icon: Users,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Đơn hàng tháng này",
      value: "328",
      change: "+18%",
      isPositive: true,
      icon: ShoppingCart,
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Doanh thu tháng này",
      value: "2.5 tỷ",
      change: "+15%",
      isPositive: true,
      icon: DollarSign,
      color: "from-amber-500 to-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Đơn hàng mới",
      description: "Đơn hàng #1234 - Bàn gỗ cao cấp",
      time: "5 phút trước",
      type: "order",
    },
    {
      id: 2,
      action: "Sản phẩm mới",
      description: 'Thêm sản phẩm "Ghế sofa hiện đại"',
      time: "15 phút trước",
      type: "product",
    },
    {
      id: 3,
      action: "Người dùng mới",
      description: "Nguyễn Văn A đã đăng ký tài khoản",
      time: "1 giờ trước",
      type: "user",
    },
    {
      id: 4,
      action: "Dự án hoàn thành",
      description: 'Dự án "Nhà máy ABC" đã hoàn thành',
      time: "2 giờ trước",
      type: "project",
    },
    {
      id: 5,
      action: "Đánh giá mới",
      description: 'Sản phẩm "Tủ quần áo" nhận 5 sao',
      time: "3 giờ trước",
      type: "review",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl mb-2">{t("admin.dashboard.title")}</h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan hệ thống.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.isPositive ? TrendingUp : TrendingDown;

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl mb-2">{stat.value}</div>
                  <div
                    className={`flex items-center text-xs ${stat.isPositive ? "text-green-600" : "text-red-600"}`}
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    <span>{stat.change} so với tháng trước</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.dashboard.recentActivities")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="h-2 w-2 rounded-full bg-amber-600 mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
