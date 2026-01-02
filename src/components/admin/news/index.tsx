import { useTranslation } from "react-i18next";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useNewsCrud } from "./hooks/use-news-crud";
import { NewsTable } from "./components/news-table";
import NewsForm from "./components/news-form";
import { NewsFormData } from "./types";
import AppButton from "@/components/atoms/app-button";

export function AdminNewsPage() {
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
    editingNews,
    onSubmit,
  } = useNewsCrud();

  // If in form mode
  if (mode === "create" || mode === "edit") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">
              {mode === "create"
                ? t("newsAdmin.createTitle", "Thêm tin tức mới")
                : t("newsAdmin.updateTitle", "Cập nhật tin tức")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? t("newsAdmin.form.createSubtitle", "Nhập thông tin tin tức")
                : t(
                    "newsAdmin.form.editSubtitle",
                    "Cập nhật thông tin tin tức"
                  )}
            </p>
          </div>
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={closeForm}
            leftSection={<IconArrowLeft size={16} />}
            label={t("newsAdmin.form.buttons.backToList", "Quay lại danh sách")}
            showArrow={false}
          />
        </div>
        <NewsForm
          news={editingNews as any}
          onSubmit={async (formData: NewsFormData) => {
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
            {t("newsAdmin.headerTitle", "Quản lý tin tức")}
          </h1>
          <p className="text-muted-foreground">
            {t("newsAdmin.headerSubtitle", "Quản lý các bài viết tin tức")}
          </p>
        </div>
        <AppButton
          variant="default"
          size="sm"
          onClick={openCreate}
          leftSection={<IconPlus size={16} />}
          label={t("newsAdmin.addNews", "Thêm tin tức")}
          showArrow={false}
        />
      </div>

      <NewsTable
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
