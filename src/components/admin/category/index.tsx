import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCategoryCrud } from "@/components/admin/category/hooks/use-category-crud";
import { CategoryDialog } from "@/components/admin/category/components/category-dialog";
import { CategoryTable } from "@/components/admin/category/components/category-table";
import { useTranslation } from "react-i18next";

export default function AdminCategoryPage() {
  const crud = useCategoryCrud();
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">{t("categories.title")}</h1>
          <p className="text-muted-foreground">{t("categories.subtitle")}</p>
        </div>
        <Button
          onClick={crud.openCreate}
          className="bg-linear-to-r from-amber-500 to-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("categories.add")}
        </Button>
      </div>

      <CategoryTable
        items={crud.items}
        searchQuery={crud.searchQuery}
        setSearchQuery={crud.setSearchQuery}
        onEdit={crud.openEdit}
        onDelete={crud.remove}
      />

      <CategoryDialog
        isOpen={crud.isDialogOpen}
        onOpenChange={crud.setIsDialogOpen}
        isEditing={!!crud.editing}
        form={crud.form}
        setForm={(fn) => crud.setForm(fn)}
        onSubmit={crud.submit}
        isSaving={crud.isSaving}
      />
    </div>
  );
}
