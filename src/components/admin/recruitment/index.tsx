import { useTranslation } from "react-i18next";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useRecruitmentCrud } from "./hooks/use-recruitment-crud";
import { RecruitmentTable } from "./components/recruitment-table";
import RecruitmentForm from "./components/recruitment-form";
import { RecruitmentFormData } from "./types";
import AppButton from "@/components/atoms/app-button";

export function AdminRecruitmentPage() {
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
    editingRecruitment,
    onSubmit,
  } = useRecruitmentCrud();

  // If in form mode
  if (mode === "create" || mode === "edit") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">
              {mode === "create"
                ? t("recruitmentAdmin.createTitle", "Thêm tin tuyển dụng mới")
                : t("recruitmentAdmin.updateTitle", "Cập nhật tin tuyển dụng")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? t(
                    "recruitmentAdmin.form.createSubtitle",
                    "Nhập thông tin tin tuyển dụng"
                  )
                : t(
                    "recruitmentAdmin.form.editSubtitle",
                    "Cập nhật thông tin tin tuyển dụng"
                  )}
            </p>
          </div>
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={closeForm}
            leftSection={<IconArrowLeft size={16} />}
            label={t(
              "recruitmentAdmin.form.buttons.backToList",
              "Quay lại danh sách"
            )}
            showArrow={false}
          />
        </div>
        <RecruitmentForm
          recruitment={editingRecruitment as any}
          onSubmit={async (formData: RecruitmentFormData) => {
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
            {t("recruitmentAdmin.headerTitle", "Quản lý tuyển dụng")}
          </h1>
          <p className="text-muted-foreground">
            {t("recruitmentAdmin.headerSubtitle", "Quản lý các tin tuyển dụng")}
          </p>
        </div>
        <AppButton
          variant="default"
          size="sm"
          onClick={openCreate}
          leftSection={<IconPlus size={16} />}
          label={t("recruitmentAdmin.addRecruitment", "Thêm tin tuyển dụng")}
          showArrow={false}
        />
      </div>

      <RecruitmentTable
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
