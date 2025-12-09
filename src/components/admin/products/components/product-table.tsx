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
} from "@mantine/core";
import { IconEdit, IconSearch, IconTrash } from "@tabler/icons-react";
import type { Product } from "@/services/api/productsService";
import { useTranslation } from "react-i18next";

export function ProductTable({
  items,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onLimitChange,
}: {
  items: Product[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}) {
  const { t } = useTranslation();
  const safeItems = Array.isArray(items) ? items : [];
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const currentPage = Math.min(Math.max(1, page), totalPages);

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

  const rows = safeItems.map((product) => {
    // const imagesCount = Array.isArray(product.images)
    //   ? product.images.length
    //   : 0;
    // const overview =
    //   product.description && typeof product.description === "object"
    //     ? String((product.description as any).overview || "")
    //     : "";
    const specs = product.technicalSpecs || {};
    const specBadges: string[] = [];
    if ((specs as any).dimensions)
      specBadges.push(String((specs as any).dimensions));
    if ((specs as any).material)
      specBadges.push(String((specs as any).material));
    if ((specs as any).weight) specBadges.push(String((specs as any).weight));

    return (
      <Table.Tr key={product.id}>
        <Table.Td>{product.id}</Table.Td>
        <Table.Td fw={500} style={truncateStyle}>
          {product.name}
        </Table.Td>
        <Table.Td>
          {product.category?.name ? (
            <Badge color="grape">{product.category.name}</Badge>
          ) : (
            <Text c="dimmed">-</Text>
          )}
        </Table.Td>
        <Table.Td ta="right">
          {product.price
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(product.price))
            : "-"}
        </Table.Td>

        <Table.Td>
          {product.warrantyPolicy ? (
            <Badge color="teal">{product.warrantyPolicy}</Badge>
          ) : (
            <Text c="dimmed">-</Text>
          )}
        </Table.Td>
        <Table.Td>{fmtDate(product.createdAt)}</Table.Td>
        <Table.Td>{fmtDate(product.updatedAt)}</Table.Td>
        <Table.Td>
          <Group gap="xs" justify="flex-end">
            <ActionIcon variant="subtle" onClick={() => onEdit(product)}>
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => onDelete(product.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Card withBorder radius="md" p={0}>
      <Group justify="space-between" p="md">
        <Title order={4}>{t("productsPage.admin.table.title")}</Title>
        <TextInput
          placeholder={t("productsPage.admin.table.searchPlaceholder")}
          leftSection={<IconSearch size={14} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
      </Group>

      <Box style={{ overflowX: "auto" }}>
        <Table miw={800} striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("productsPage.admin.table.columns.id")}</Table.Th>
              <Table.Th>{t("productsPage.admin.table.columns.name")}</Table.Th>
              <Table.Th>
                {t("productsPage.admin.table.columns.category")}
              </Table.Th>
              <Table.Th ta="right">
                {t("productsPage.admin.table.columns.price")}
              </Table.Th>
              <Table.Th>
                {t("productsPage.admin.table.columns.warranty")}
              </Table.Th>
              <Table.Th>
                {t("productsPage.admin.table.columns.createdAt")}
              </Table.Th>
              <Table.Th>
                {t("productsPage.admin.table.columns.updatedAt")}
              </Table.Th>
              <Table.Th ta="right">
                {t("productsPage.admin.table.columns.actions")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={11}>
                  <Text c="dimmed" ta="center" py="lg">
                    {t("productsPage.admin.table.noProducts")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify="space-between" p="md">
        <Text size="sm">
          {t("productsPage.admin.table.total")}: {total}{" "}
          {t("productsPage.admin.table.items")} •{" "}
          {t("productsPage.admin.table.page")} {currentPage}/{totalPages}
        </Text>
        <Pagination
          total={totalPages}
          value={currentPage}
          onChange={onPageChange}
        />
        {onLimitChange && (
          <Group gap="xs">
            <Text size="sm">{t("productsPage.admin.table.display")}</Text>
            <Select
              style={{ width: 80 }}
              value={String(limit)}
              onChange={(value) => onLimitChange(Number(value))}
              data={["10", "20", "50"]}
            />
          </Group>
        )}
      </Group>
    </Card>
  );
}
