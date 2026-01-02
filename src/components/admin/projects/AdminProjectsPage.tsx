import { useTranslation } from "react-i18next";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { ProjectTable } from "@/components/admin/projects/components/project-table";
import { useProjectCrud } from "@/components/admin/projects/hooks/use-project-crud";
import ProjectForm from "@/components/admin/projects/components/project-form";

import { FormData } from "./types";
import AppButton from "@/components/atoms/app-button";

export function AdminProjectsPage() {
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    mode,
    openCreate,
    openEdit,
    closeForm,
    remove,
    editingProject,
    onSubmit,
  } = useProjectCrud();

  // Category state and handlers removed

  // If in project form mode
  if (mode === "create" || mode === "edit") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">
              {mode === "create"
                ? t("projectsAdmin.createTitle", "Thêm dự án mới")
                : t("projectsAdmin.updateTitle", "Cập nhật dự án")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? t("projectsAdmin.form.createSubtitle", "Nhập thông tin dự án")
                : t(
                    "projectsAdmin.form.editSubtitle",
                    "Cập nhật thông tin dự án"
                  )}
            </p>
          </div>
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={closeForm}
            leftSection={<IconArrowLeft size={16} />}
            label={t(
              "projectsAdmin.form.buttons.backToList",
              "Quay lại danh sách"
            )}
            showArrow={false}
          />
        </div>
        <ProjectForm
          project={editingProject as any}
          onSubmit={async (formData: FormData) => {
            await onSubmit(formData);
          }}
          onCancel={closeForm}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">
            {t("projectsAdmin.headerTitle", "Quản lý dự án")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "projectsAdmin.headerSubtitle",
              "Quản lý danh mục dự án và các dự án đang thực hiện"
            )}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <AppButton
          variant="default"
          size="sm"
          onClick={openCreate}
          leftSection={<IconPlus size={16} />}
          label={t("projectsAdmin.addProject", "Thêm dự án")}
          showArrow={false}
        />
      </div>
      <ProjectTable
        data={data}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onEdit={openEdit}
        onDelete={remove}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
