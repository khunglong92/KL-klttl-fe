import { useMemo, useState } from "react";
import { modals } from "@mantine/modals";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/services/hooks/useCategories";
import type { Category } from "@/services/api/categoriesService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useCategoryCrud() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const { data, isFetching } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || "" });
  };

  const submit = async () => {
    if (!form.name.trim()) {
      toast.error(t("categories.toast.nameRequired"));
      return;
    }
    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          body: {
            name: form.name.trim(),
            description: form.description || undefined,
          },
        });
        toast.success(t("categories.toast.updateSuccess"));
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          description: form.description || undefined,
        });
        toast.success(t("categories.toast.createSuccess"));
      }
    } catch (e: any) {
      toast.error(e?.message || "Error");
    }
  };

  const remove = (id: number) => {
    modals.openConfirmModal({
      title: t("categories.deleteConfirmTitle") || "Xác nhận xóa danh mục",
      children:
        t("categories.deleteConfirmMessage") ||
        "Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.",
      centered: true,
      labels: {
        confirm: t("common.delete") || "Xóa",
        cancel: t("common.cancel") || "Hủy",
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          toast.success(t("categories.toast.deleteSuccess"));
        } catch (e: any) {
          toast.error(e?.message || "Error");
        }
      },
    });
  };

  const reorderItems = async (newOrder: Category[]) => {
    try {
      // Use map to identify new indices, then filter where index changed
      const payload = newOrder
        .map((item, index) => ({
          id: item.id,
          orderIndex: index,
          originalOrderIndex: item.orderIndex,
        }))
        .filter((item) => item.orderIndex !== item.originalOrderIndex)
        .map(({ id, orderIndex }) => ({ id, orderIndex }));

      // If nothing changed effectively (shouldn't happen if filtered well upstream, but safe to check)
      if (payload.length === 0) return;

      await import("@/services/api/categoriesService").then((m) =>
        m.categoriesService.reorder(payload)
      );

      // Invalidate to fetch fresh data (ensure orderIndex is updated in local cache)
      await queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success(
        t("categories.toast.reorderSuccess") || "Sắp xếp thành công"
      );
    } catch (e: any) {
      toast.error(e?.message || "Error reordering");
    }
  };

  return {
    // data
    items: filtered,
    isFetching,
    // search
    searchQuery,
    setSearchQuery,
    // dialog & form
    editing,
    form,
    setForm,
    // actions
    openCreate,
    openEdit,
    submit,
    remove,
    reorderItems,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
