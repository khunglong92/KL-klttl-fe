import {
  Modal,
  Badge,
  Stack,
  Group,
  Text,
  Title,
  Box,
  ThemeIcon,
  Grid,
  Paper,
} from "@mantine/core";
import type { Contact } from "@/services/api/contactsService";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconCheck,
} from "@tabler/icons-react";
import AppButton from "@/components/atoms/app-button";

interface ContactDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onConfirm?: (id: string) => void;
}

export function ContactDetailDialog({
  isOpen,
  onOpenChange,
  contact,
  onConfirm,
}: ContactDetailDialogProps) {
  const { t } = useTranslation();

  if (!contact) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(contact.id);
    }
    onOpenChange(false);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => onOpenChange(false)}
      title={<Title order={3}>{t("contacts.detailTitle")}</Title>}
      size="xl"
      centered
    >
      <Stack gap="lg" className="p-10">
        <Group justify="space-between">
          <Text fw={500} c="dimmed">
            {t("contacts.title")}
          </Text>
          <Title order={4}>{contact.title}</Title>
          {contact.isConfirmed ? (
            <Badge color="green" variant="light">
              {t("contacts.confirmed")}
            </Badge>
          ) : (
            <Badge color="yellow" variant="light">
              {t("contacts.pending")}
            </Badge>
          )}
        </Group>

        <Stack gap="sm">
          <Text fw={500} c="dimmed">
            {t("contacts.name")}
          </Text>
          <Text>{contact.name}</Text>
        </Stack>

        <Grid gutter="lg">
          {contact.email && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" radius="md">
                  <IconMail size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" c="dimmed">
                    {t("contacts.email")}
                  </Text>
                  <Text size="sm" style={{ wordBreak: "break-all" }}>
                    {contact.email}
                  </Text>
                </Box>
              </Group>
            </Grid.Col>
          )}

          {contact.phone && (
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Group wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" radius="md">
                  <IconPhone size={16} />
                </ThemeIcon>
                <Box>
                  <Text size="sm" c="dimmed">
                    {t("contacts.phone")}
                  </Text>
                  <Text size="sm">{contact.phone}</Text>
                </Box>
              </Group>
            </Grid.Col>
          )}
        </Grid>

        {contact.address && (
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" radius="md">
              <IconMapPin size={16} />
            </ThemeIcon>
            <Box>
              <Text size="sm" c="dimmed">
                {t("contacts.address")}
              </Text>
              <Text size="sm">{contact.address}</Text>
            </Box>
          </Group>
        )}

        <Box>
          <Text size="sm" fw={500} c="dimmed">
            {t("contacts.content")}
          </Text>
          <Paper withBorder p="md" mt="xs" radius="md">
            <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
              {contact.content}
            </Text>
          </Paper>
        </Box>

        <Group gap="xs" c="dimmed">
          <IconCalendar size={16} />
          <Text size="xs">
            {t("contacts.createdAt")}:{" "}
            {format(new Date(contact.createdAt), "dd/MM/yyyy HH:mm")}
          </Text>
        </Group>
      </Stack>

      <Group justify="flex-end" mt="xl">
        <AppButton
          variant="outline"
          onClick={() => onOpenChange(false)}
          htmlType="button"
          label={t("common.close")}
          showArrow={false}
          leftSection={<IconCheck size={16} />}
        />

        {!contact.isConfirmed && (
          <AppButton
            htmlType="submit"
            label={t("contacts.confirmContact")}
            onClick={handleConfirm}
            leftSection={<IconCheck size={16} />}
            showArrow={false}
          />
        )}
      </Group>
    </Modal>
  );
}
