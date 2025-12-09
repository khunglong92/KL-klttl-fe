import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { useProductCrud } from "@/components/admin/products/hooks/use-product-crud";

import { ProductTable } from "@/components/admin/products/components/product-table";
import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/products/components/product-form";
import { IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";

export default function AdminProductPage() {
  const { t } = useTranslation();
  const crud = useProductCrud();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");

  useEffect(() => {
    if (mode === "create") {
      crud.openCreate();
      crud.setIsDialogOpen(false);
    }
  }, [mode]);

  return (
    <Stack p="lg">
      {mode === "list" && (
        <>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2}>{t("productsPage.admin.title")}</Title>
              <Text c="dimmed">{t("productsPage.admin.subtitle")}</Text>
            </Stack>
            <AppButton
              variant="default"
              showArrow={false}
              label={t("productsPage.admin.addProduct")}
              onClick={() => setMode("create")}
              leftSection={<IconPlus size={16} />}
              size="sm"
            />
          </Group>

          <ProductTable
            items={crud.items}
            searchQuery={crud.searchQuery}
            setSearchQuery={crud.setSearchQuery}
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
          />
        </>
      )}

      {mode !== "list" && (
        <Stack>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2}>
                {mode === "create"
                  ? t("productsPage.admin.createTitle")
                  : t("productsPage.admin.editTitle")}
              </Title>
              <Text c="dimmed">
                {mode === "create"
                  ? t("productsPage.admin.createSubtitle")
                  : t("productsPage.admin.editSubtitle")}
              </Text>
            </Stack>
            <Button variant="default" onClick={() => setMode("list")}>
              {t("productsPage.admin.backToList")}
            </Button>
          </Group>

          <ProductForm
            isEditing={mode === "edit"}
            form={crud.form as any}
            setForm={(next) => crud.setForm(next as any)}
            onSubmit={async (finalForm) => {
              await crud.submit(finalForm as any);
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
