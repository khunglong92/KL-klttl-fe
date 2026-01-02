import { Group, Stack, Text, Title } from "@mantine/core";
import { useProductCrud } from "@/components/admin/products/hooks/use-product-crud";
import { ProductTable } from "@/components/admin/products/components/product-table";
import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/products/components/product-form";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import AppButton from "@/components/atoms/app-button";

export default function AdminProductPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";
  const crud = useProductCrud();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");

  useEffect(() => {
    if (mode === "create") {
      crud.openCreate();
      crud.setIsDialogOpen(false);
    }
  }, [mode]);

  return (
    <Stack gap="xl" p={{ base: "md", md: "xl" }}>
      {mode === "list" && (
        <>
          <Group justify="space-between" align="flex-end">
            <Stack gap="xs">
              <Title order={1} c={textColor}>
                {t("productsPage.admin.title")}
              </Title>
              <Text size="lg" c="dimmed">
                {t("productsPage.admin.subtitle")}
              </Text>
            </Stack>
            <AppButton
              variant="default"
              size="sm"
              onClick={() => setMode("create")}
              leftSection={<IconPlus size={16} />}
              label={t("productsPage.admin.addProduct")}
              showArrow={false}
            />
          </Group>

          <ProductTable
            items={crud.items}
            searchQuery={crud.searchQuery}
            setSearchQuery={crud.setSearchQuery}
            categories={crud.categories}
            categoryIdFilter={crud.categoryIdFilter}
            setCategoryIdFilter={(v) => {
              crud.setCategoryIdFilter(v);
              crud.setPage(1); // Reset to first page when filter changes
            }}
            onEdit={(p) => {
              crud.openEdit(p as any);
              crud.setIsDialogOpen(false);
              setMode("edit");
            }}
            onDelete={crud.remove}
            page={crud.page}
            limit={crud.limit}
            total={crud.total}
            onPageChange={(p) => crud.setPage(p)}
            onLimitChange={(l) => {
              crud.setLimit(l);
              crud.setPage(1);
            }}
            onReorder={crud.reorder}
          />
        </>
      )}

      {mode !== "list" && (
        <Stack gap="xl">
          <Group justify="space-between" align="flex-end">
            <Stack gap="xs">
              <Title order={1} c={textColor}>
                {mode === "create"
                  ? t("productsPage.admin.createTitle")
                  : t("productsPage.admin.editTitle")}
              </Title>
              <Text size="lg" c="dimmed">
                {mode === "create"
                  ? t("productsPage.admin.createSubtitle")
                  : t("productsPage.admin.editSubtitle")}
              </Text>
            </Stack>
            <AppButton
              variant="outline-primary"
              size="sm"
              onClick={() => setMode("list")}
              leftSection={<IconArrowLeft size={16} />}
              label={t("productsPage.admin.backToList")}
              showArrow={false}
            />
          </Group>

          <ProductForm
            isEditing={mode === "edit"}
            form={crud.form}
            onSubmit={async (finalForm) => {
              await crud.submit(finalForm);
              setMode("list");
            }}
            onCancel={() => setMode("list")}
            isSaving={crud.isSaving}
            categories={crud.categories}
          />
        </Stack>
      )}
    </Stack>
  );
}
