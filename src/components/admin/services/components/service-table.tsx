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
  Box,
  Tooltip,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconEdit,
  IconSearch,
  IconTrash,
  IconPhoto,
} from "@tabler/icons-react";
import type {
  PaginatedServicesResponse,
  CompanyService,
  ServiceStatus,
} from "@/services/api/servicesService";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { Reorder, useDragControls, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";

const statusVariant: Record<ServiceStatus, string> = {
  published: "green",
  draft: "gray",
  archived: "red",
};

interface ServiceTableProps {
  data: PaginatedServicesResponse | undefined;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (s: CompanyService) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  page: number;
  isLoading?: boolean;
  onReorder?: (newOrder: CompanyService[]) => void;
}

interface RowItemProps {
  service: CompanyService;
  displayIndex: number;
  textColor: string;
  statusVariant: Record<ServiceStatus, string>;
  t: any;
  onEdit: (s: CompanyService) => void;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
}

const RowItem = ({
  service,
  displayIndex,
  textColor,
  statusVariant,
  t,
  onEdit,
  onDelete,
  onDragEnd,
}: RowItemProps) => {
  const controls = useDragControls();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const imageCount = service.images?.length || 0;

  return (
    <Reorder.Item
      value={service}
      as="tr"
      id={service.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border-b ${isDark ? "bg-[#1a202c] border-gray-700" : "bg-white"}`}
      style={{ position: "relative" }} // Ensure positioning context
    >
      <Table.Td>
        <div
          className="flex items-center justify-center cursor-move p-2 rounded"
          onPointerDown={(e) => controls.start(e)}
        >
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </Table.Td>
      <Table.Td ta="center">
        <Text size="sm" fw={600} c={textColor}>
          {service.orderIndex ?? displayIndex}
        </Text>
      </Table.Td>

      <Table.Td>
        <Tooltip label={service.id} withArrow>
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
            {service.id.slice(0, 8)}...
          </Text>
        </Tooltip>
      </Table.Td>

      <Table.Td fw={600}>
        <Text size="md" c={textColor} lineClamp={2}>
          {service.name || service.name}
        </Text>
      </Table.Td>

      <Table.Td ta="center">
        <Group gap={4} justify="center">
          <IconPhoto size={16} color="gray" />
          <Text size="sm" fw={500} c={textColor}>
            {imageCount}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge variant="light" color={statusVariant[service.status] || "gray"}>
          {service.status}
        </Badge>
      </Table.Td>

      <Table.Td>
        {service.isFeatured ? (
          <Badge size="sm" color="orange" variant="filled">
            {t("servicesAdmin.table.featured")}
          </Badge>
        ) : (
          <Badge size="sm" color="gray" variant="outline">
            {t("servicesAdmin.table.standard")}
          </Badge>
        )}
      </Table.Td>

      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon variant="light" size="lg" onClick={() => onEdit(service)}>
            <IconEdit size={20} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="lg"
            color="red"
            onClick={() => onDelete(service.id)}
          >
            <IconTrash size={20} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Reorder.Item>
  );
};

export function ServiceTable({
  data,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  onPageChange,
  page,
  isLoading,
  onReorder,
}: ServiceTableProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const textColor = theme === "dark" ? "white" : "black";
  const services = data?.data || [];
  const total = data?.pagination?.total || 0;
  const limit = data?.pagination?.perpage || 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const [localItems, setLocalItems] = useState(services);

  useEffect(() => {
    setLocalItems(services);
  }, [services]);

  const handleDragEnd = () => {
    const currentIds = services.map((i) => i.id).join(",");
    const newIds = localItems.map((i) => i.id).join(",");

    if (currentIds !== newIds) {
      onReorder?.(localItems);
    }
  };

  return (
    <Card
      withBorder
      radius="lg"
      p={0}
      shadow="sm"
      style={{ position: "relative", minHeight: 400 }}
    >
      <LoadingOverlay visible={!!isLoading} overlayProps={{ blur: 2 }} />

      <Group justify="space-between" p="xl" pb="md">
        <Title order={3} c={textColor}>
          {t("servicesAdmin.listTitle", "Danh sách dịch vụ")}
        </Title>
      </Group>

      <Group px="xl" pb="lg">
        <TextInput
          size="md"
          placeholder={t(
            "servicesAdmin.searchPlaceholder",
            "Tìm kiếm dịch vụ..."
          )}
          leftSection={<IconSearch size={18} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          style={{ flex: 1, maxWidth: 400 }}
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
            <Table.Tr bg={theme === "dark" ? "dark.6" : "gray.1"}>
              <Table.Th style={{ width: 50 }}></Table.Th>
              <Table.Th ta="center" style={{ width: 60 }} fw={700}>
                STT
              </Table.Th>
              <Table.Th style={{ width: 100 }} fw={700}>
                {t("servicesAdmin.table.columns.id")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("servicesAdmin.table.columns.name")}
              </Table.Th>
              <Table.Th ta="center" fw={700} style={{ width: 80 }}>
                {t("servicesAdmin.table.columns.image")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("servicesAdmin.table.columns.status")}
              </Table.Th>
              <Table.Th fw={700}>
                {t("servicesAdmin.table.columns.featured")}
              </Table.Th>
              <Table.Th ta="right" fw={700}>
                {t("servicesAdmin.table.columns.actions")}
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
                localItems.map((service, index) => {
                  const startOrder = (page - 1) * limit;
                  const displayIndex = startOrder + index + 1;
                  return (
                    <RowItem
                      key={service.id}
                      service={service}
                      displayIndex={displayIndex}
                      textColor={textColor}
                      statusVariant={statusVariant}
                      t={t}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDragEnd={handleDragEnd}
                    />
                  );
                })
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Text c="dimmed" ta="center" py="xl" size="lg">
                      {t("servicesAdmin.table.noData")}
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
          {t("common.total")}: {total} {t("servicesAdmin.items")} •{" "}
          {t("common.page")} {page}/{totalPages}
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
    </Card>
  );
}
