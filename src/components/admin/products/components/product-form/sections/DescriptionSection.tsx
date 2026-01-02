import {
  Button,
  Text,
  TextInput,
  Title,
  Stack,
  Group,
  ActionIcon,
  Box,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  shortDescriptions: any;
  register: any;
}

export function DescriptionSection({ shortDescriptions, register }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <Stack gap="lg">
      <Box>
        <Title order={3} c={textColor}>
          {t("productsPage.admin.form.sections.shortDescription")}
        </Title>
        <Text size="sm" c="dimmed">
          {t("productsPage.admin.form.labels.summaryHint")}
        </Text>
      </Box>
      <Stack gap="md">
        {shortDescriptions.fields.map((field: any, index: number) => (
          <Group key={field.id} align="flex-end">
            <TextInput
              size="md"
              label={
                <Text
                  size="sm"
                  fw={500}
                  c={textColor}
                  component="span"
                >{`${t("productsPage.admin.form.labels.description", "Mô tả")} ${index + 1}`}</Text>
              }
              placeholder={t(
                "productsPage.admin.form.placeholders.shortDescription"
              )}
              style={{ flex: 1 }}
              {...register(`description.${index}` as any)}
            />
            {shortDescriptions.fields.length > 1 && (
              <ActionIcon
                color="red"
                variant="light"
                size="lg"
                onClick={() => shortDescriptions.remove(index)}
              >
                <IconTrash size={20} />
              </ActionIcon>
            )}
          </Group>
        ))}
        <Button
          size="md"
          type="button"
          variant="light"
          onClick={() => shortDescriptions.append("")}
          fullWidth
          leftSection={<IconPlus size={18} />}
          mt="sm"
        >
          {t("productsPage.admin.form.labels.addDescription")}
        </Button>
      </Stack>
    </Stack>
  );
}
