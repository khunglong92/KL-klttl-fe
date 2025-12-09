import { useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || "" });
    setIsDialogOpen(true);
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
      setIsDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Error");
    }
  };

  const remove = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("categories.toast.deleteSuccess"));
    } catch (e: any) {
      toast.error(e?.message || "Error");
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
    isDialogOpen,
    setIsDialogOpen,
    editing,
    form,
    setForm,
    // actions
    openCreate,
    openEdit,
    submit,
    remove,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
