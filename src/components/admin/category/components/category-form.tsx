import {
  Button,
  Card,
  Group,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function CategoryForm({
  isEditing,
  form,
  setForm,
  onSubmit,
  onCancel,
  isSaving,
}: {
  isEditing: boolean;
  form: { name: string; description: string };
  setForm: (
    updater: (prev: { name: string; description: string }) => {
      name: string;
      description: string;
    }
  ) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <Stack gap="xl">
      <Card withBorder radius="lg" p="xl" shadow="sm">
        <Title order={3} mb="lg" c={textColor}>
          {t("categories.formTitle")}
        </Title>
        <Stack gap="md">
          <TextInput
            label={t("categories.name")}
            placeholder={t("categories.name")}
            size="md"
            value={form.name}
            onChange={(e) => {
              const value = e.target?.value || "";
              setForm((s) => ({ ...s, name: value }));
            }}
            required
            error={!form.name && t("categories.toast.nameRequired")}
          />
          <Textarea
            label={t("categories.description")}
            placeholder={t("categories.description")}
            size="md"
            rows={6}
            value={form.description}
            onChange={(e) => {
              const value = e.target?.value || "";
              setForm((s) => ({ ...s, description: value }));
            }}
          />
        </Stack>
      </Card>

      <Card
        withBorder
        radius="lg"
        p="md"
        shadow="md"
        pos="sticky"
        bottom={10}
        style={{
          zIndex: 10,
          backgroundColor:
            theme === "dark"
              ? "rgba(36, 36, 36, 0.9)"
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Group justify="flex-end">
          <Button
            type="button"
            variant="subtle"
            size="lg"
            color="gray"
            onClick={onCancel}
            disabled={isSaving}
          >
            {t("categories.cancel")}
          </Button>
          <Button
            type="button"
            loading={isSaving}
            size="lg"
            leftSection={<IconDeviceFloppy size={22} />}
            px="xl"
            onClick={onSubmit}
            disabled={!form.name}
          >
            {isEditing ? t("categories.update") : t("categories.save")}
          </Button>
        </Group>
      </Card>
    </Stack>
  );
}
