import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCcw } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslation } from "react-i18next";
import statisticsService, {
  GrowthStat,
  CategoryStat,
} from "@/services/api/statisticsService";
import { toast } from "sonner";

export function AdminStatistics() {
  const { t } = useTranslation();
  const [growthData, setGrowthData] = useState<GrowthStat[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [growthRes, categoryRes] = await Promise.all([
        statisticsService.getGrowthStats(),
        statisticsService.getCategoryStats(),
      ]);

      if (growthRes) setGrowthData(growthRes.reverse()); // Reverse to show oldest to newest
      if (categoryRes) setCategoryData(categoryRes);
    } catch (error) {
      console.error(error);
      toast.error(t("common.error", "Có lỗi xảy ra khi tải dữ liệu thống kê"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">
            {t("admin.statistics.title", "Thống kê & Báo cáo")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "admin.statistics.subtitle",
              "Phân tích dữ liệu kinh doanh chi tiết"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {t("common.refresh", "Làm mới")}
          </Button>
          {/* Export button placeholder */}
          <Button
            className="bg-gradient-to-r from-amber-500 to-orange-600"
            disabled
          >
            <Download className="mr-2 h-4 w-4" />
            {t("common.export", "Xuất báo cáo")}
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart (Quotes & Contacts) */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {t(
                "admin.statistics.growthTitle",
                "Biểu đồ tăng trưởng (6 tháng gần nhất)"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {growthData.length > 0 ? (
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="quotes"
                    fill="#3b82f6"
                    name={t("dashboard.quotes", "Báo giá")}
                  />
                  <Bar
                    dataKey="contacts"
                    fill="#10b981"
                    name={t("dashboard.contacts", "Liên hệ")}
                  />
                </BarChart>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {isLoading
                    ? t("admin.statistics.loading")
                    : t("admin.statistics.noData")}
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t(
                "admin.statistics.categoryDistribution",
                "Phân bố sản phẩm theo danh mục"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {categoryData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {isLoading
                    ? t("admin.statistics.loading")
                    : t("admin.statistics.noData")}
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Placeholder for Top Services/Products - needs logic to count views or specific interactions */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("admin.statistics.topItems", "Top danh mục")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((cat, index) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cat.name}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold">
                    {cat.value} {t("common.products", "SP")}
                  </div>
                </motion.div>
              ))}
              {categoryData.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                  {isLoading
                    ? t("admin.statistics.loading")
                    : t("admin.statistics.noData")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
