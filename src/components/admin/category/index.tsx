import { Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import AppButton from "@/components/atoms/app-button";
import { useCategoryCrud } from "@/components/admin/category/hooks/use-category-crud";
import { CategoryTable } from "@/components/admin/category/components/category-table";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import CategoryForm from "./components/category-form";

export default function AdminCategoryPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const crud = useCategoryCrud();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");

  return (
    <Stack gap="xl" p={{ base: "md", md: "xl" }}>
      {mode === "list" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <Title order={1} mb="xs" c={textColor}>
                {t("categories.title")}
              </Title>
              <Text size="lg" c="dimmed">
                {t("categories.subtitle")}
              </Text>
            </div>
            <AppButton
              variant="default"
              size="sm"
              onClick={() => {
                crud.openCreate();
                setMode("create");
              }}
              leftSection={<IconPlus size={16} />}
              label={t("categories.add")}
              showArrow={false}
            />
          </div>

          <CategoryTable
            items={crud.items}
            searchQuery={crud.searchQuery}
            setSearchQuery={crud.setSearchQuery}
            onEdit={(c) => {
              crud.openEdit(c);
              setMode("edit");
            }}
            onDelete={crud.remove}
            onReorder={crud.reorderItems}
          />
        </>
      )}

      {mode !== "list" && (
        <Stack gap="xl">
          <Group justify="space-between" align="flex-end">
            <Stack gap="xs">
              <Title order={1} c={textColor}>
                {mode === "create"
                  ? t("categories.createTitle")
                  : t("categories.updateTitle")}
              </Title>
              <Text size="lg" c="dimmed">
                {mode === "create"
                  ? t("categories.createSubtitle")
                  : t("categories.updateSubtitle")}
              </Text>
            </Stack>
            <AppButton
              variant="outline-primary"
              size="sm"
              onClick={() => setMode("list")}
              leftSection={<IconArrowLeft size={16} />}
              label={t("categories.backToList")}
              showArrow={false}
            />
          </Group>

          <CategoryForm
            isEditing={mode === "edit"}
            form={crud.form}
            setForm={crud.setForm}
            onSubmit={async () => {
              await crud.submit();
              setMode("list");
            }}
            onCancel={() => setMode("list")}
            isSaving={crud.isSaving}
          />
        </Stack>
      )}
    </Stack>
  );
}
