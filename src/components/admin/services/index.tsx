import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
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
  } = useServiceCrud();

  if (mode === "create" || mode === "edit") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">
              {mode === "create"
                ? t("services.admin.createTitle")
                : t("services.admin.updateTitle")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? "Nhập thông tin dịch vụ"
                : "Cập nhật thông tin dịch vụ"}
            </p>
          </div>
          <Button variant="outline" onClick={closeForm}>
            Quay lại danh sách
          </Button>
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
          <h1 className="text-3xl mb-2">{t("services.admin.title")}</h1>
          <p className="text-muted-foreground">
            {t("services.admin.subtitle")}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("services.admin.add")}
        </Button>
      </div>

      <ServiceTable
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onEdit={openEdit}
        onDelete={remove}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
