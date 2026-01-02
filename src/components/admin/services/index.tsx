import { useTranslation } from "react-i18next";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import AppButton from "@/components/atoms/app-button";
import { ServiceTable } from "@/components/admin/services/components/service-table";
import { useServiceCrud } from "@/components/admin/services/hooks/use-service-crud";
import ServiceForm from "@/components/admin/services/components/service-form";

export function AdminServicesPage() {
  const { t } = useTranslation();
  const {
    data,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    mode,
    openCreate,
    openEdit,
    closeForm,
    remove,
    editingService,
    onSubmit,
    isSaving,
    reorderItems,
  } = useServiceCrud();

  if (mode === "create" || mode === "edit") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">
              {mode === "create"
                ? t("servicesAdmin.createTitle")
                : t("servicesAdmin.updateTitle")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? t("servicesAdmin.createSubtitle")
                : t("servicesAdmin.updateSubtitle")}
            </p>
          </div>
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={closeForm}
            leftSection={<IconArrowLeft size={16} />}
            label={t("common.backToList", "Quay lại danh sách")}
            showArrow={false}
          />
        </div>
        <ServiceForm
          isEditing={mode === "edit"}
          form={editingService ?? {}}
          onSubmit={onSubmit}
          onCancel={closeForm}
          isSaving={isSaving}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">{t("servicesAdmin.title")}</h1>
          <p className="text-muted-foreground">{t("servicesAdmin.subtitle")}</p>
        </div>
        <AppButton
          variant="default"
          size="sm"
          onClick={openCreate}
          leftSection={<IconPlus size={16} />}
          label={t("servicesAdmin.add")}
          showArrow={false}
        />
      </div>

      <ServiceTable
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onEdit={openEdit}
        onDelete={remove}
        onReorder={reorderItems}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
