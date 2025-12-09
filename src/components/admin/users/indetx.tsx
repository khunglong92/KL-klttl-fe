import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, ShieldCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      role: "Admin",
      status: "Hoạt động",
      joinDate: "15/01/2024",
      lastLogin: "02/11/2025",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      role: "Nhân viên",
      status: "Hoạt động",
      joinDate: "20/02/2024",
      lastLogin: "01/11/2025",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      role: "Khách hàng",
      status: "Hoạt động",
      joinDate: "10/03/2024",
      lastLogin: "03/11/2025",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      role: "Khách hàng",
      status: "Bị khóa",
      joinDate: "05/04/2024",
      lastLogin: "15/10/2025",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      role: "Nhân viên",
      status: "Hoạt động",
      joinDate: "12/05/2024",
      lastLogin: "03/11/2025",
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-600 hover:bg-red-700";
      case "Nhân viên":
        return "bg-blue-600 hover:bg-blue-700";
      case "Khách hàng":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản lý người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản người dùng hệ thống
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách người dùng</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lần đăng nhập cuối</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Tham gia: {user.joinDate}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Hoạt động" ? "default" : "destructive"
                      }
                      className={
                        user.status === "Hoạt động"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Quyền admin">
                        <ShieldCheck className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Khóa tài khoản"
                      >
                        <UserX className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
