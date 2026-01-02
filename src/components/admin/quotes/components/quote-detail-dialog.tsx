import AppButton from "@/components/atoms/app-button";
import { Quote } from "@/services/api/quotesService";
import {
  Title,
  Text,
  Stack,
  Group,
  Badge,
  ScrollArea,
  Box,
  Modal,
  Paper,
} from "@mantine/core";
import { AttachmentPreview } from "./attachment-preview";
import { IconCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface QuoteDetailDialogProps {
  opened: boolean;
  onClose: () => void;
  quote: Quote | null;
  onConfirm: (id: string) => void;
  isConfirming: boolean;
}

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Paper withBorder p="md" radius="md" shadow="xs">
    <Title order={5} mb="sm" c="dimmed" tt="uppercase">
      {title}
    </Title>
    <Stack gap="sm">{children}</Stack>
  </Paper>
);

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Box>
    <Text size="xs" c="dimmed">
      {label}
    </Text>
    <Text size="sm" fw={500}>
      {value || "-"}
    </Text>
  </Box>
);

export function QuoteDetailDialog({
  opened,
  onClose,
  quote,
  onConfirm,
  isConfirming,
}: QuoteDetailDialogProps) {
  const { t } = useTranslation();

  if (!quote) return null;

  return (
    <Modal
      opened={opened}
      withCloseButton
      onClose={onClose}
      size="lg"
      radius="md"
      centered
      title={<Title order={3}>{t("quotes.detail.title")}</Title>}
      classNames={{ header: "items-start", title: "flex-1" }}
    >
      <ScrollArea style={{ height: "70vh" }} p="xs">
        <Stack gap="md">
          <DetailSection title={t("quotes.detail.customerInfo")}>
            <DetailItem label={t("quotes.detail.name")} value={quote.name} />
            <DetailItem
              label={t("quotes.detail.email")}
              value={
                <a
                  href={`mailto:${quote.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {quote.email}
                </a>
              }
            />
            <DetailItem
              label={t("quotes.detail.phone")}
              value={
                <a
                  href={`tel:${quote.phone}`}
                  className="text-blue-500 hover:underline"
                >
                  {quote.phone}
                </a>
              }
            />
            <DetailItem
              label={t("quotes.detail.company")}
              value={quote.company}
            />
            <DetailItem
              label={t("quotes.detail.jobTitle")}
              value={quote.title}
            />
            <DetailItem
              label={t("quotes.detail.address")}
              value={quote.address}
            />
          </DetailSection>

          <DetailSection title={t("quotes.detail.projectInfo")}>
            <DetailItem
              label={t("quotes.detail.projectName")}
              value={quote.projectName}
            />
            <DetailItem
              label={t("quotes.detail.projectType")}
              value={quote.projectType}
            />
            <DetailItem
              label={t("quotes.detail.budget")}
              value={quote.budget}
            />
            <DetailItem
              label={t("quotes.detail.expectedCompletion")}
              value={quote.expectedCompletion}
            />
            <DetailItem
              label={t("quotes.detail.projectDescription")}
              value={
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                  {quote.projectDescription}
                </Text>
              }
            />
          </DetailSection>

          <DetailSection title={t("quotes.detail.technicalRequirements")}>
            <DetailItem
              label={t("quotes.detail.requirements")}
              value={
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                  {quote.technicalRequirements}
                </Text>
              }
            />
            {quote.attachmentUrl && (
              <Box mt="sm">
                <Text size="xs" c="dimmed" mb={4} tt="uppercase">
                  {t("quotes.detail.attachments")}
                </Text>
                <AttachmentPreview url={quote.attachmentUrl} />
              </Box>
            )}
          </DetailSection>

          <DetailSection title={t("quotes.detail.additionalInfo")}>
            <DetailItem
              label={t("quotes.detail.content")}
              value={
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                  {quote.content}
                </Text>
              }
            />
          </DetailSection>

          <DetailSection title={t("quotes.detail.status")}>
            <DetailItem
              label={t("quotes.status")}
              value={
                <Badge
                  color={quote.isConfirmed ? "green" : "orange"}
                  variant="light"
                  size="md"
                >
                  {quote.isConfirmed
                    ? t("quotes.confirmed")
                    : t("quotes.pending")}
                </Badge>
              }
            />
            <DetailItem
              label={t("quotes.detail.createdAt")}
              value={new Date(quote.createdAt).toLocaleString()}
            />
          </DetailSection>
        </Stack>
      </ScrollArea>
      <Group
        justify="flex-end"
        mt="md"
        pt="md"
        className="border-t border-gray-200 dark:border-gray-700"
      >
        <AppButton
          onClick={() => onConfirm(quote.id)}
          loading={isConfirming}
          disabled={quote.isConfirmed}
          leftSection={<IconCheck size={16} />}
          label={
            quote.isConfirmed
              ? t("quotes.confirmed")
              : t("quotes.actions.confirm")
          }
          size="sm"
        />
      </Group>
    </Modal>
  );
}
