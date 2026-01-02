import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, Title, Input } from "@mantine/core";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Search, Trash2, GripVertical } from "lucide-react";
import type { Category } from "@/services/api/categoriesService";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

interface CategoryTableProps {
  items: Category[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
  onReorder?: (newOrder: Category[]) => void;
}

interface ItemProps {
  category: Category;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
  onDragEnd?: () => void;
}

const RowItem = ({ category, onEdit, onDelete, onDragEnd }: ItemProps) => {
  const controls = useDragControls();
  const { theme } = useTheme();

  return (
    <Reorder.Item
      value={category}
      as="tr"
      id={String(category.id)}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border-b ${theme === "dark" ? "bg-[#1a202c] border-gray-700" : "bg-white"}`}
    >
      <TableCell className="w-[50px]">
        <div
          className="flex items-center justify-center cursor-move p-2 rounded"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </TableCell>
      <TableCell>{category.orderIndex}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className="max-w-[420px] truncate">
        {category.description}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
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
    </Reorder.Item>
  );
};

export function CategoryTable({
  items,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  onReorder,
}: CategoryTableProps & {
  onReorder?: (newOrder: Category[]) => void;
}) {
  const { t } = useTranslation();
  const [localItems, setLocalItems] = useState(items);

  // Sync local items when props change (e.g. initial load or external update)
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleDragEnd = () => {
    // Only trigger API call if the order actually changed
    // We compare mapped IDs to be safe and simple
    const currentIds = items.map((i) => i.id).join(",");
    const newIds = localItems.map((i) => i.id).join(",");

    if (currentIds !== newIds) {
      onReorder?.(localItems);
    }
  };

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
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>{t("categories.table.id")}</TableHead>
            <TableHead>{t("categories.name")}</TableHead>
            <TableHead>{t("categories.description")}</TableHead>
            <TableHead className="text-right">
              {t("categories.table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <Reorder.Group
          as="tbody"
          values={localItems}
          onReorder={setLocalItems}
          className="w-full"
        >
          <AnimatePresence>
            {localItems.map((category) => (
              <RowItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onDelete={onDelete}
                onDragEnd={handleDragEnd}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </Table>
    </Card>
  );
}
