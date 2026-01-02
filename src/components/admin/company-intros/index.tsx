import { Group, Stack, Text, Title, Loader, Center } from "@mantine/core";
import { useCompanyIntroCrud } from "./hooks/use-company-intro-crud";
import { CompanyIntroTable } from "./components/company-intro-table";
import { CompanyIntroForm } from "./components/company-intro-form";
import { useEffect, useState } from "react";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import AppButton from "@/components/atoms/app-button";
import { useTranslation } from "react-i18next";

export default function AdminCompanyIntroPage() {
  const { t } = useTranslation();
  const crud = useCompanyIntroCrud();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");

  useEffect(() => {
    if (mode === "create") {
      crud.openCreate();
      crud.setIsDialogOpen(false);
    }
  }, [mode]);

  if (crud.isLoading) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Stack p="lg">
      {mode === "list" && (
        <>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2}>{t("admin.companyIntros.title")}</Title>
              <Text c="dimmed">{t("admin.companyIntros.subtitle")}</Text>
            </Stack>
            <AppButton
              variant="default"
              showArrow={false}
              label={t("admin.companyIntros.addImage")}
              onClick={() => setMode("create")}
              leftSection={<IconPlus size={16} />}
              size="sm"
            />
          </Group>

          <CompanyIntroTable
            items={crud.items}
            onEdit={(item) => {
              crud.openEdit(item);
              crud.setIsDialogOpen(false);
              setMode("edit");
            }}
            onDelete={crud.remove}
            onToggleActive={crud.toggleActive}
          />
        </>
      )}

      {mode !== "list" && (
        <Stack>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2}>
                {mode === "create"
                  ? t("admin.companyIntros.createTitle")
                  : t("admin.companyIntros.editTitle")}
              </Title>
              <Text c="dimmed">
                {mode === "create"
                  ? t("admin.companyIntros.createSubtitle")
                  : t("admin.companyIntros.editSubtitle")}
              </Text>
            </Stack>
            <AppButton
              variant="outline-primary"
              size="sm"
              onClick={() => setMode("list")}
              leftSection={<IconArrowLeft size={16} />}
              label={t("admin.companyIntros.backToList")}
              showArrow={false}
            />
          </Group>

          <CompanyIntroForm
            isEditing={mode === "edit"}
            form={crud.form}
            setForm={crud.setForm}
            onSubmit={async (finalForm) => {
              await crud.submit(finalForm);
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
