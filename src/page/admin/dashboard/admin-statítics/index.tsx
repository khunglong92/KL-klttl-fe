import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, TrendingUp, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { format } from "date-fns";

export function AdminStatistics() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [filterType, setFilterType] = useState("month");

  const monthlyData = [
    { month: "T1", orders: 45, revenue: 450000000, products: 120 },
    { month: "T2", orders: 52, revenue: 520000000, products: 140 },
    { month: "T3", orders: 48, revenue: 480000000, products: 130 },
    { month: "T4", orders: 61, revenue: 610000000, products: 165 },
    { month: "T5", orders: 55, revenue: 550000000, products: 148 },
    { month: "T6", orders: 67, revenue: 670000000, products: 180 },
    { month: "T7", orders: 59, revenue: 590000000, products: 159 },
    { month: "T8", orders: 72, revenue: 720000000, products: 195 },
    { month: "T9", orders: 68, revenue: 680000000, products: 183 },
    { month: "T10", orders: 75, revenue: 750000000, products: 202 },
    { month: "T11", orders: 81, revenue: 810000000, products: 218 },
  ];

  const categoryData = [
    { name: "Gia công kim loại", value: 35, color: "#3b82f6" },
    { name: "Đột dập", value: 25, color: "#a855f7" },
    { name: "Cắt laser", value: 20, color: "#f59e0b" },
    { name: "Thi công trần", value: 15, color: "#10b981" },
    { name: "Khác", value: 5, color: "#6b7280" },
  ];

  const topProducts = [
    { name: "Gia công kim loại tấm", sold: 156, revenue: "780,000,000 VNĐ" },
    { name: "Cắt laser CNC", sold: 134, revenue: "670,000,000 VNĐ" },
    { name: "Đột dập chi tiết", sold: 98, revenue: "490,000,000 VNĐ" },
    { name: "Chấn gấp kim loại", sold: 87, revenue: "435,000,000 VNĐ" },
    { name: "Thi công trần thạch cao", sold: 76, revenue: "380,000,000 VNĐ" },
  ];

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: "683",
      change: "+12.5%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Doanh thu",
      value: "6.8 tỷ",
      change: "+18.2%",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Sản phẩm đã bán",
      value: "1,840",
      change: "+23.1%",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Khách hàng mới",
      value: "245",
      change: "+8.7%",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Thống kê & Báo cáo</h1>
          <p className="text-muted-foreground">
            Phân tích dữ liệu kinh doanh chi tiết
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  "Chọn khoảng thời gian"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange(range || {})}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Lọc theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Theo tuần</SelectItem>
              <SelectItem value="month">Theo tháng</SelectItem>
              <SelectItem value="quarter">Theo quý</SelectItem>
              <SelectItem value="year">Theo năm</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}
                >
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm text-muted-foreground mb-2">
                  {stat.title}
                </h3>
                <div className="flex items-end justify-between">
                  <div className="text-3xl">{stat.value}</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    new Intl.NumberFormat("vi-VN").format(value) + " VNĐ"
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Doanh thu"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ đơn hàng theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" name="Đơn hàng" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo danh mục dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 dịch vụ bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sold} đơn
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    <p>{product.revenue}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
