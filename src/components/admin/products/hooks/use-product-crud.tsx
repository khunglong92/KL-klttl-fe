import { useMemo, useState } from "react";
import {
  useProductsPaginated,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useReorderProducts,
} from "@/services/hooks/useProducts";
import { useCategories } from "@/services/hooks/useCategories";
import type {
  CreateProductDto,
  Product,
  UpdateProductDto,
} from "@/services/api/productsService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { ProductsPage } from "@/services/hooks/useProducts";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export function useProductCrud() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
  const [categoryIdFilter, setCategoryIdFilter] = useState<number | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    description: [],
    detailedDescription: "",
    price: "",
    images: [],
    categoryId: null,
    isFeatured: true,
    showPrice: true,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const pagedResult = useProductsPaginated(
    page,
    limit,
    debouncedSearchQuery,
    categoryIdFilter
  );
  const paged: ProductsPage | undefined = pagedResult.data as unknown as
    | ProductsPage
    | undefined;
  const items = useMemo(() => {
    return paged?.data ?? [];
  }, [paged]);
  const total = paged?.total ?? 0;

  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const reorderMutation = useReorderProducts();

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: [],
      detailedDescription: "",
      price: "",
      images: [],
      categoryId: null,
      isFeatured: true,
      showPrice: true,
    });
    setIsDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || [],
      detailedDescription: p.detailedDescription || "",
      price: p.price || "",
      images: p.images || [],
      categoryId: p.categoryId ?? null,
      isFeatured: p.isFeatured ?? true,
      showPrice: p.showPrice ?? true,
    });
    setIsDialogOpen(true);
  };

  const { t } = useTranslation();

  const submit = async (payload: any) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          body: payload as UpdateProductDto,
        });
        toast.success(t("productsPage.admin.form.toasts.updateSuccess"));
      } else {
        await createMutation.mutateAsync(payload as CreateProductDto);
        toast.success(t("productsPage.admin.form.toasts.saveSuccess"));
      }
      setIsDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.message || t("productsPage.admin.form.toasts.error"));
    }
  };

  const remove = (id: string) => {
    modals.openConfirmModal({
      title: (
        <Text fw={700}>
          {t("productsPage.admin.table.deleteConfirmTitle") ||
            "Xác nhận xóa sản phẩm"}
        </Text>
      ),
      children: (
        <Text size="sm">
          {t("productsPage.admin.table.deleteConfirmMessage") ||
            "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."}
        </Text>
      ),
      centered: true,
      labels: { confirm: "Xóa ngay", cancel: "Hủy bỏ" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id as any);
          toast.success(t("productsPage.admin.form.toasts.deleteSuccess"));
        } catch (e: any) {
          toast.error(
            e?.message || t("productsPage.admin.form.toasts.deleteError")
          );
        }
      },
    });
  };

  const reorder = async (newItems: Product[]) => {
    // If pagination is used, we need to respect it for orderIndex
    const payload = newItems.map((item, index) => ({
      id: item.id,
      orderIndex: (page - 1) * limit + index,
    }));
    try {
      await reorderMutation.mutateAsync(payload);
    } catch {
      toast.error(t("common.error") || "Error");
    }
  };

  return {
    items: items,
    total,
    page,
    limit,
    setPage,
    setLimit,
    categories: categories ?? [],
    searchQuery,
    setSearchQuery,
    categoryIdFilter,
    setCategoryIdFilter,
    isDialogOpen,
    setIsDialogOpen,
    editing,
    form,
    setForm,
    openCreate,
    openEdit,
    submit,
    remove,
    reorder,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
