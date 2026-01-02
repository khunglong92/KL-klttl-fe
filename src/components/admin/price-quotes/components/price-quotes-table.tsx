import { useTranslation } from "react-i18next";
import {
  Table,
  Group,
  Card,
  Title,
  Text,
  ActionIcon,
  Badge,
  Box,
  TextInput,
  Pagination,
  Image,
  Modal,
} from "@mantine/core";
import { IconEdit, IconTrash, IconSearch } from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useState, useEffect } from "react";
import { PriceQuote, PriceQuotesResponse } from "../types";
import AppButton from "@/components/atoms/app-button";

interface PriceQuotesTableProps {
  data?: PriceQuotesResponse;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onEdit: (quote: PriceQuote) => void;
  onDelete: (id: string) => void;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function PriceQuotesTable({
  data,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  page,
  perPage,
  onPageChange,
  isLoading,
}: PriceQuotesTableProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebouncedValue(localSearch, 400);

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const quotes = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <Card withBorder radius="lg" p={0} shadow="sm">
      <Group justify="space-between" p="xl" pb="md">
        <Title order={3} c={textColor}>
          {t("priceQuotesAdmin.table.title", "Danh sách báo giá")}
        </Title>
      </Group>

      <Group px="xl" pb="lg">
        <TextInput
          size="md"
          placeholder={t(
            "priceQuotesAdmin.table.searchPlaceholder",
            "Tìm kiếm báo giá..."
          )}
          leftSection={<IconSearch size={18} />}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
          radius="md"
        />
      </Group>

      <Box style={{ overflowX: "auto" }}>
        <Table
          miw={800}
          verticalSpacing="md"
          horizontalSpacing="xl"
          highlightOnHover
        >
          <Table.Thead>
            <Table.Tr bg={theme === "dark" ? "dark.6" : "gray.1"}>
              <Table.Th ta="center" style={{ width: 60 }} fw={700}>
                STT
              </Table.Th>
              <Table.Th style={{ width: 80 }} fw={700}>
                {t("priceQuotesAdmin.table.columns.image", "Ảnh")}
              </Table.Th>
              <Table.Th fw={700} style={{ width: "30%" }}>
                {t("priceQuotesAdmin.table.columns.title", "Tiêu đề")}
              </Table.Th>
              <Table.Th fw={700} style={{ width: "30%" }}>
                {t("priceQuotesAdmin.table.columns.subtitle", "Tiêu đề phụ")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("priceQuotesAdmin.table.columns.featured", "Nổi bật")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("priceQuotesAdmin.table.columns.status", "Trạng thái")}
              </Table.Th>
              <Table.Th ta="right" fw={700}>
                {t("priceQuotesAdmin.table.columns.actions", "Hành động")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="xl">
                    {t("common.loading", "Đang tải...")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : quotes.length > 0 ? (
              quotes.map((item, idx) => (
                <Table.Tr key={item.id}>
                  <Table.Td ta="center">
                    <Text size="sm" fw={600} c={textColor}>
                      {(page - 1) * perPage + idx + 1}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt="Thumbnail"
                        width={60}
                        height={40}
                        fit="cover"
                        radius="sm"
                        fallbackSrc="https://placehold.co/60x40?text=No+Img"
                      />
                    ) : (
                      <Box
                        w={60}
                        h={40}
                        bg="gray.2"
                        style={{
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text size="xs" c="dimmed">
                          No img
                        </Text>
                      </Box>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="md" fw={600} c={textColor} lineClamp={2}>
                      {item.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {item.subtitle || "-"}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {item.isFeatured ? (
                      <Badge color="yellow" variant="filled">
                        {t("priceQuotesAdmin.table.featured", "Nổi bật")}
                      </Badge>
                    ) : (
                      <Text size="sm" c="dimmed">
                        -
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {item.isActive ? (
                      <Badge color="green" variant="filled">
                        Active
                      </Badge>
                    ) : (
                      <Badge color="red" variant="outline">
                        Inactive
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <ActionIcon
                        variant="light"
                        size="lg"
                        onClick={() => onEdit(item)}
                      >
                        <IconEdit size={20} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        size="lg"
                        color="red"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="xl" size="lg">
                    {t(
                      "priceQuotesAdmin.table.noData",
                      "Không có báo giá nào."
                    )}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group
        justify="space-between"
        p="xl"
        bg={theme === "dark" ? "dark.8" : "gray.0"}
      >
        <Text size="md" fw={500} c={textColor}>
          {t("common.total", "Tổng")}: {total}{" "}
          {t("priceQuotesAdmin.items", "báo giá")} • {t("common.page", "Trang")}{" "}
          {page}/{totalPages}
        </Text>
        <Pagination
          size="md"
          total={totalPages}
          value={page}
          onChange={onPageChange}
          radius="md"
          withEdges
        />
      </Group>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={!!deleteId}
        onClose={handleCancelDelete}
        title={
          <div className="text-center font-bold text-2xl">
            {t("priceQuotesAdmin.delete.title", "Xác nhận xoá")}
          </div>
        }
        centered
        size="sm"
      >
        <div className="px-2 py-10">
          <Text className="text-center">
            {t(
              "priceQuotesAdmin.delete.confirm",
              "Bạn có chắc chắn muốn xoá báo giá này? Hành động này không thể hoàn tác."
            )}
          </Text>

          <div className="w-full flex justify-center items-center gap-x-4 mt-10">
            <AppButton
              label={t("common.cancel", "Huỷ")}
              variant="outline-primary"
              onClick={handleCancelDelete}
            />
            <AppButton
              label={t("common.delete", "Xoá")}
              onClick={handleConfirmDelete}
              loading={isDeleting}
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
}
