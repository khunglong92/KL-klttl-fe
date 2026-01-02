import { Quote } from "@/services/api/quotesService";
import {
  Table,
  Badge,
  Group,
  ActionIcon,
  Text,
  Pagination,
  Box,
} from "@mantine/core";
import { IconEye, IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface QuoteTableProps {
  quotes: Quote[];
  onViewDetail: (quote: Quote) => void;
  onConfirm: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  totalItems: number;
}

export function QuoteTable({
  quotes,
  onViewDetail,
  onConfirm,
  page,
  totalPages,
  onPageChange,
  limit,
  totalItems,
}: QuoteTableProps) {
  const { t } = useTranslation();

  const rows = quotes.map((quote) => (
    <Table.Tr key={quote.id}>
      <Table.Td>{quote.name}</Table.Td>
      <Table.Td>{quote.projectName}</Table.Td>
      <Table.Td>{quote.email}</Table.Td>
      <Table.Td>{quote.phone}</Table.Td>
      <Table.Td>
        <Badge color={quote.isConfirmed ? "green" : "red"}>
          {quote.isConfirmed ? t("quotes.confirmed") : t("quotes.pending")}
        </Badge>
      </Table.Td>
      <Table.Td>{new Date(quote.createdAt).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            onClick={() => onViewDetail(quote)}
            title={t("quotes.actions.viewDetail")}
          >
            <IconEye size={16} />
          </ActionIcon>
          {!quote.isConfirmed && (
            <ActionIcon
              variant="light"
              color="green"
              onClick={() => onConfirm(quote.id)}
              title={t("quotes.actions.confirm")}
            >
              <IconCheck size={16} />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  return (
    <Box>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("quotes.table.name")}</Table.Th>
              <Table.Th>{t("quotes.table.projectName")}</Table.Th>
              <Table.Th>{t("quotes.table.email")}</Table.Th>
              <Table.Th>{t("quotes.table.phone")}</Table.Th>
              <Table.Th>{t("quotes.table.status")}</Table.Th>
              <Table.Th>{t("quotes.table.createdAt")}</Table.Th>
              <Table.Th>{t("quotes.table.actions")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text ta="center" py="lg">
                    {t("quotes.table.noData")}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </tbody>
        </Table>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <Group justify="space-between" mt="md">
          <Text size="sm">
            {t("contacts.showing", { from: from, to: to, total: totalItems })}
          </Text>
          <Pagination total={totalPages} value={page} onChange={onPageChange} />
        </Group>
      )}
    </Box>
  );
}
