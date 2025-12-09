import { motion } from "framer-motion";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Search, Trash2, CheckCircle, XCircle } from "lucide-react";
import type {
  PaginatedServicesResponse,
  CompanyService,
  ServiceStatus,
} from "@/services/api/servicesService";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

const statusVariant: Record<
  ServiceStatus,
  "default" | "secondary" | "destructive"
> = {
  published: "default",
  draft: "secondary",
  archived: "destructive",
};

export function ServiceTable({
  data,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  onPageChange,
  page,
}: {
  data: PaginatedServicesResponse | undefined;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (s: CompanyService) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  page: number;
}) {
  const { t } = useTranslation();
  const services = data?.data || [];

  const totalPages = data?.pagination
    ? Math.ceil(data.pagination.total / data.pagination.perpage)
    : 1;

  return (
    <div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("services.admin.listTitle")}</CardTitle>
          <div className="relative w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("services.admin.searchPlaceholder")}
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
              <TableHead>No</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Nổi bật</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {services?.map((service, index) => (
              <motion.tr
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TableCell className="max-w-[100px] truncate font-mono text-xs">
                  {index + 1}
                </TableCell>
                <TableCell>{service.title}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[service.status]}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {service.isFeatured ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>{service.orderIndex ?? 0}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(service.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        {services.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Không tìm thấy dịch vụ nào.
          </div>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex justify-end border-t pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) onPageChange(page - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) onPageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </div>
  );
}
