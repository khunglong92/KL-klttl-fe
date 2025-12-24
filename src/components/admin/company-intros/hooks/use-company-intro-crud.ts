import { useState } from "react";
import {
  useCompanyIntrosAdmin,
  useCreateCompanyIntro,
  useUpdateCompanyIntro,
  useDeleteCompanyIntro,
  useToggleCompanyIntroActive,
} from "@/services/hooks/useCompanyIntros";
import type {
  CompanyIntro,
  CreateCompanyIntroDto,
  UpdateCompanyIntroDto,
} from "@/services/api/companyIntroService";
import { toast } from "sonner";

export interface CompanyIntroFormState {
  url: string;
  description: string;
  subDescription: string;
  orderIndex: number;
  isActive: boolean;
}

const defaultForm: CompanyIntroFormState = {
  url: "",
  description: "",
  subDescription: "",
  orderIndex: 0,
  isActive: true,
};

export function useCompanyIntroCrud() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyIntro | null>(null);
  const [form, setForm] = useState<CompanyIntroFormState>(defaultForm);

  // Queries
  const { data: items, isLoading } = useCompanyIntrosAdmin();

  // Mutations
  const createMutation = useCreateCompanyIntro();
  const updateMutation = useUpdateCompanyIntro();
  const deleteMutation = useDeleteCompanyIntro();
  const toggleActiveMutation = useToggleCompanyIntroActive();

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsDialogOpen(true);
  };

  const openEdit = (item: CompanyIntro) => {
    setEditing(item);
    setForm({
      url: item.url,
      description: item.description || "",
      subDescription: item.subDescription || "",
      orderIndex: item.orderIndex,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const submit = async (overrideForm?: CompanyIntroFormState) => {
    const source = overrideForm ?? form;
    if (!source.url.trim()) {
      toast.error("URL hình ảnh là bắt buộc");
      return;
    }

    try {
      if (editing) {
        const payload: UpdateCompanyIntroDto = {
          url: source.url.trim(),
          description: source.description.trim() || undefined,
          subDescription: source.subDescription.trim() || undefined,
          orderIndex: source.orderIndex,
          isActive: source.isActive,
        };
        await updateMutation.mutateAsync({ id: editing.id, body: payload });
        toast.success("Cập nhật thành công");
      } else {
        const payload: CreateCompanyIntroDto = {
          url: source.url.trim(),
          description: source.description.trim() || undefined,
          subDescription: source.subDescription.trim() || undefined,
          orderIndex: source.orderIndex,
          isActive: source.isActive,
        };
        await createMutation.mutateAsync(payload);
        toast.success("Thêm mới thành công");
      }
      setIsDialogOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Có lỗi xảy ra");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã xóa thành công!");
    } catch (e: any) {
      toast.error(e?.message || "Xóa thất bại");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await toggleActiveMutation.mutateAsync({ id, isActive });
      toast.success(isActive ? "Đã kích hoạt" : "Đã ẩn");
    } catch (e: any) {
      toast.error(e?.message || "Có lỗi xảy ra");
    }
  };

  return {
    items: items ?? [],
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editing,
    form,
    setForm,
    openCreate,
    openEdit,
    submit,
    remove,
    toggleActive,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
