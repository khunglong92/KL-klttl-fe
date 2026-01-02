import {
  Table,
  Group,
  Pagination,
  Card,
  TextInput,
  Title,
  Text,
  ActionIcon,
  Badge,
  Select,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconSearch,
  IconTrash,
  IconPhoto,
} from "@tabler/icons-react";
import type { Product } from "@/services/api/productsService";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface CategoryItem {
  id: number;
  name: string;
}

interface ProductTableProps {
  items: Product[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categories?: CategoryItem[];
  categoryIdFilter?: number;
  setCategoryIdFilter?: (v: number | undefined) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onReorder?: (newOrder: Product[]) => void;
}

interface RowItemProps {
  product: Product;
  displayIndex: number;
  textColor: string;
  truncateStyle: React.CSSProperties;
  t: any;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
  fmtDate: (iso?: string) => string;
  onDragEnd: () => void;
}

const RowItem = ({
  product,
  displayIndex,
  textColor,
  truncateStyle,
  t,
  onEdit,
  onDelete,
  isDark,
  fmtDate,
  onDragEnd,
}: RowItemProps) => {
  const controls = useDragControls();
  const imageCount = Array.isArray(product.images) ? product.images.length : 0;

  return (
    <Reorder.Item
      value={product}
      as="tr"
      id={product.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border-b ${isDark ? "bg-[#1a202c] border-gray-700" : "bg-white"}`}
      style={{ position: "relative" }}
    >
      <Table.Td>
        <div
          className="flex items-center justify-center cursor-move p-2 rounded"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </Table.Td>

      {/* Index Column - shows orderIndex */}
      <Table.Td ta="center">
        <Text size="sm" fw={600} c={textColor}>
          {product.orderIndex !== undefined && product.orderIndex !== null
            ? product.orderIndex
            : displayIndex}
        </Text>
      </Table.Td>

      {/* ID Column with Tooltip */}
      <Table.Td>
        <Tooltip label={product.id} position="top" withArrow multiline w={300}>
          <Text
            size="xs"
            c="dimmed"
            style={{
              maxWidth: 80,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "help",
            }}
          >
            {product.id.slice(0, 8)}...
          </Text>
        </Tooltip>
      </Table.Td>

      {/* Name Column */}
      <Table.Td fw={600} style={truncateStyle}>
        <Text size="md" c={textColor}>
          {product.name}
        </Text>
      </Table.Td>

      {/* Category Column */}
      <Table.Td>
        {product.category?.name ? (
          <Badge color="grape" size="md">
            {product.category.name}
          </Badge>
        ) : (
          <Badge variant="outline" color="gray" size="md">
            {t("productsPage.admin.table.unknownCategory")}
          </Badge>
        )}
      </Table.Td>

      {/* Image Count Column */}
      <Table.Td ta="center">
        <Group gap={4} justify="center">
          <IconPhoto size={16} color="gray" />
          <Text size="sm" fw={500} c={textColor}>
            {imageCount}
          </Text>
        </Group>
      </Table.Td>

      {/* Price Column */}
      <Table.Td ta="right" fw={700}>
        <Text size="md" c={textColor}>
          {product.price
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(product.price))
            : t("productsPage.admin.table.contactPrice")}
        </Text>
      </Table.Td>

      {/* Status Column */}
      <Table.Td ta="center">
        <Group gap={6} justify="center">
          {product.isFeatured && (
            <Badge size="sm" color="orange" variant="filled">
              {t("productsPage.admin.table.featured")}
            </Badge>
          )}
          {product.showPrice ? (
            <Badge size="sm" color="green" variant="light">
              {t("productsPage.admin.table.showPrice")}
            </Badge>
          ) : (
            <Badge size="sm" color="gray" variant="light">
              {t("productsPage.admin.table.hidePrice")}
            </Badge>
          )}
        </Group>
      </Table.Td>

      {/* Created At Column */}
      <Table.Td ta="center">
        <Text size="sm" c={textColor}>
          {fmtDate(product.createdAt)}
        </Text>
      </Table.Td>

      {/* Actions Column */}
      <Table.Td>
        <Group gap="xs" justify="center">
          <ActionIcon variant="light" size="lg" onClick={() => onEdit(product)}>
            <IconEdit size={20} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="lg"
            color="red"
            onClick={() => onDelete(product.id)}
          >
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Reorder.Item>
  );
};

export function ProductTable({
  items,
  searchQuery,
  setSearchQuery,
  categories = [],
  categoryIdFilter,
  setCategoryIdFilter,
  onEdit,
  onDelete,
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onLimitChange,
  onReorder,
}: ProductTableProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = theme === "dark" ? "white" : "black";

  const safeItems = Array.isArray(items) ? items : [];
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const [localItems, setLocalItems] = useState(safeItems);

  useEffect(() => {
    setLocalItems(safeItems);
  }, [safeItems]);

  const handleDragEnd = () => {
    const currentIds = safeItems.map((i) => i.id).join(",");
    const newIds = localItems.map((i) => i.id).join(",");

    if (currentIds !== newIds) {
      onReorder?.(localItems);
    }
  };

  const truncateStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  };

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("vi-VN") : "-";

  // Build category options for filter
  const categoryOptions = [
    {
      value: "",
      label: t("productsPage.admin.table.allCategories", {
        defaultValue: "Tất cả danh mục",
      }),
    },
    ...categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ];

  return (
    <Card withBorder radius="lg" p={0} shadow="sm">
      {/* Header with Title */}
      <Group justify="space-between" p="xl" pb="md">
        <Title order={3} c={textColor}>
          {t("productsPage.admin.table.title")}
        </Title>
      </Group>

      {/* Filter Row */}
      <Group px="xl" pb="lg" gap="md">
        <TextInput
          size="md"
          placeholder={t("productsPage.admin.table.searchPlaceholder")}
          leftSection={<IconSearch size={18} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
          radius="md"
        />
        <Select
          size="md"
          placeholder={t("productsPage.admin.table.filterByCategory", {
            defaultValue: "Lọc theo danh mục",
          })}
          data={categoryOptions}
          value={categoryIdFilter ? String(categoryIdFilter) : ""}
          onChange={(value) => {
            setCategoryIdFilter?.(value ? Number(value) : undefined);
          }}
          clearable
          style={{ width: 250 }}
          radius="md"
        />
      </Group>

      <Box style={{ overflowX: "auto" }}>
        <Table
          miw={1000}
          verticalSpacing="md"
          horizontalSpacing="xl"
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr
              bg={theme === "dark" ? "dark.6" : "gray.1"}
              style={{ borderBottom: "2px solid var(--mantine-color-gray-4)" }}
            >
              <Table.Th style={{ width: 50 }}></Table.Th>
              <Table.Th ta="center" style={{ width: 60 }} fw={700}>
                {t("productsPage.admin.table.columns.index")}
              </Table.Th>
              <Table.Th style={{ width: 100 }} fw={700}>
                {t("productsPage.admin.table.columns.id")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("productsPage.admin.table.columns.name")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("productsPage.admin.table.columns.category")}
              </Table.Th>
              <Table.Th ta="center" fw={700} style={{ width: 80 }}>
                {t("productsPage.admin.table.columns.image")}
              </Table.Th>
              <Table.Th ta="right" fw={700}>
                {t("productsPage.admin.table.columns.price")}
              </Table.Th>
              <Table.Th ta="center" fw={700}>
                {t("productsPage.admin.table.columns.status")}
              </Table.Th>
              <Table.Th ta="center" fw={700}>
                {t("productsPage.admin.table.columns.createdAt")}
              </Table.Th>
              <Table.Th ta="center" fw={700}>
                {t("productsPage.admin.table.columns.actions")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Reorder.Group
            as="tbody"
            values={localItems}
            onReorder={setLocalItems}
            className="w-full"
          >
            <AnimatePresence>
              {localItems.length > 0 ? (
                localItems.map((product, index) => {
                  const displayIndex = (currentPage - 1) * limit + index + 1;

                  return (
                    <RowItem
                      key={product.id}
                      product={product}
                      displayIndex={displayIndex}
                      textColor={textColor}
                      truncateStyle={truncateStyle}
                      t={t}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDark={isDark}
                      fmtDate={fmtDate}
                      onDragEnd={handleDragEnd}
                    />
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={10}>
                    <Text c="dimmed" ta="center" py="xl" size="lg">
                      {t("productsPage.admin.table.noProducts")}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </AnimatePresence>
          </Reorder.Group>
        </Table>
      </Box>

      <Group
        justify="space-between"
        p="xl"
        bg={theme === "dark" ? "dark.8" : "gray.0"}
      >
        <Text size="md" fw={500} c={textColor}>
          {t("productsPage.admin.table.total")}: {total}{" "}
          {t("productsPage.admin.table.items")} •{" "}
          {t("productsPage.admin.table.page")} {currentPage}/{totalPages}
        </Text>
        <Pagination
          size="md"
          total={totalPages}
          value={currentPage}
          onChange={onPageChange}
          radius="md"
          withEdges
        />
        {onLimitChange && (
          <Group gap="xs">
            <Text size="md" c={textColor}>
              {t("productsPage.admin.table.display")}
            </Text>
            <Select
              size="sm"
              style={{ width: 100 }}
              value={String(limit)}
              onChange={(value) => onLimitChange(Number(value))}
              data={["10", "20", "50"]}
              radius="md"
            />
          </Group>
        )}
      </Group>
    </Card>
  );
}
