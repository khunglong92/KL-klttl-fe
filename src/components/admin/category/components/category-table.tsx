import { motion } from "framer-motion";
import { Card, Title, Input } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Search, Trash2 } from "lucide-react";
import type { Category } from "@/services/api/categoriesService";
import { useTranslation } from "react-i18next";

interface CategoryTableProps {
  items: Category[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryTable({
  items,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { t } = useTranslation();
  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <div className="flex items-center justify-between">
          <Title order={4}>{t("categories.listTitle")}</Title>
          <Input
            placeholder={t("categories.searchPlaceholder")}
            leftSection={<Search size={14} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ width: "288px" }}
          />
        </div>
      </Card.Section>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>{t("categories.name")}</TableHead>
            <TableHead>{t("categories.description")}</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(items || [])?.map((category, index) => (
            <motion.tr
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="max-w-[420px] truncate">
                {category.description}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
