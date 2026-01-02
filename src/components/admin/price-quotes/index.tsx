import { useTranslation } from "react-i18next";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { usePriceQuotesCrud } from "./hooks/use-price-quotes-crud";
import { PriceQuotesTable } from "./components/price-quotes-table";
import PriceQuotesForm from "./components/price-quotes-form";
import { PriceQuoteFormData } from "./types";
import AppButton from "@/components/atoms/app-button";

export function AdminPriceQuotesPage() {
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
    editingQuote,
    onSubmit,
  } = usePriceQuotesCrud();

  // If in form mode
  if (mode === "create" || mode === "edit") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">
              {mode === "create"
                ? t("priceQuotesAdmin.createTitle", "Thêm báo giá mới")
                : t("priceQuotesAdmin.updateTitle", "Cập nhật báo giá")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create"
                ? t(
                    "priceQuotesAdmin.form.createSubtitle",
                    "Nhập thông tin báo giá"
                  )
                : t(
                    "priceQuotesAdmin.form.editSubtitle",
                    "Cập nhật thông tin báo giá"
                  )}
            </p>
          </div>
          <AppButton
            variant="outline-primary"
            size="sm"
            onClick={closeForm}
            leftSection={<IconArrowLeft size={16} />}
            label={t(
              "priceQuotesAdmin.form.buttons.backToList",
              "Quay lại danh sách"
            )}
            showArrow={false}
          />
        </div>
        <PriceQuotesForm
          quote={editingQuote as any}
          onSubmit={async (formData: PriceQuoteFormData) => {
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
            {t("priceQuotesAdmin.headerTitle", "Quản lý báo giá")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "priceQuotesAdmin.headerSubtitle",
              "Quản lý các bài viết báo giá"
            )}
          </p>
        </div>
        <AppButton
          variant="default"
          size="sm"
          onClick={openCreate}
          leftSection={<IconPlus size={16} />}
          label={t("priceQuotesAdmin.addQuote", "Thêm báo giá")}
          showArrow={false}
        />
      </div>

      <PriceQuotesTable
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
