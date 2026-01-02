import {
  Table,
  Group,
  Card,
  Title,
  Text,
  ActionIcon,
  Badge,
  Box,
  Switch,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { CompanyIntro } from "@/services/api/companyIntroService";
import { useTranslation } from "react-i18next";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";

export function CompanyIntroTable({
  items,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  items: CompanyIntro[];
  onEdit: (item: CompanyIntro) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}) {
  const { t } = useTranslation();
  const safeItems = Array.isArray(items) ? items : [];

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("vi-VN") : "-";

  const rows = safeItems.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>
        <AppThumbnailImage
          src={item.url}
          alt={item.description || "Company Intro"}
          width={80}
          height={50}
          fit="cover"
        />
      </Table.Td>
      <Table.Td style={{ maxWidth: 300 }}>
        <Text size="sm" lineClamp={2}>
          {item.description || "-"}
        </Text>
      </Table.Td>
      <Table.Td ta="center">
        <Badge color="blue">{item.orderIndex}</Badge>
      </Table.Td>
      <Table.Td ta="center">
        <Switch
          checked={item.isActive}
          onChange={(e) => onToggleActive(item.id, e.currentTarget.checked)}
          color="green"
          size="sm"
        />
      </Table.Td>
      <Table.Td>{fmtDate(item.createdAt)}</Table.Td>
      <Table.Td>{fmtDate(item.updatedAt)}</Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon variant="subtle" onClick={() => onEdit(item)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => onDelete(item.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card withBorder radius="md" p={0}>
      <Group justify="space-between" p="md">
        <Title order={4}>{t("admin.companyIntros.table.title")}</Title>
        <Text size="sm" c="dimmed">
          {t("admin.companyIntros.table.totalImages", {
            count: safeItems.length,
          })}
        </Text>
      </Group>

      <Box style={{ overflowX: "auto" }}>
        <Table miw={700} striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                {t("admin.companyIntros.table.columns.image")}
              </Table.Th>
              <Table.Th>
                {t("admin.companyIntros.table.columns.description")}
              </Table.Th>
              <Table.Th ta="center">
                {t("admin.companyIntros.table.columns.order")}
              </Table.Th>
              <Table.Th ta="center">
                {t("admin.companyIntros.table.columns.status")}
              </Table.Th>
              <Table.Th>
                {t("admin.companyIntros.table.columns.createdAt")}
              </Table.Th>
              <Table.Th>
                {t("admin.companyIntros.table.columns.updatedAt")}
              </Table.Th>
              <Table.Th ta="right">
                {t("admin.companyIntros.table.columns.actions")}
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="lg">
                    {t("admin.companyIntros.table.noData")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
}
