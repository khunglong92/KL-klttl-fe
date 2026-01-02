import { useState } from "react";
import { modals } from "@mantine/modals";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateService,
  useDeleteService,
  useServices,
  useUpdateService,
  type CompanyService,
} from "@/services/hooks/useServices";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ServiceFormData } from "../components/service-form/hooks/use-service-form";
import { servicesService } from "@/services/api/servicesService";

export function useServiceCrud() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingService, setEditingService] =
    useState<Partial<CompanyService> | null>(null);

  const [page, setPage] = useState(1);

  const { data, isFetching } = useServices({
    page,
    search: searchQuery,
    perpage: 10,
  });

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const openCreate = () => {
    setEditingService({});
    setMode("create");
  };

  const openEdit = (service: CompanyService) => {
    setEditingService(service);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingService(null);
    setMode("list");
  };

  const onSubmit = async (formData: ServiceFormData) => {
    try {
      if (editingService?.id) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          body: formData,
        });
        toast.success(t("services.toast.updateSuccess"));
      } else {
        await createMutation.mutateAsync(formData as any);
        toast.success(t("services.toast.createSuccess"));
      }
      closeForm();
    } catch (e: any) {
      toast.error(e?.message || "Error");
      throw e;
    }
  };

  const remove = (id: string) => {
    modals.openConfirmModal({
      title: t("services.admin.deleteConfirmTitle") || "Xác nhận xóa dịch vụ",
      children:
        t("services.admin.deleteConfirmMessage") ||
        "Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.",
      centered: true,
      labels: {
        confirm: t("common.delete") || "Xóa",
        cancel: t("common.cancel") || "Hủy",
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          toast.success(t("services.admin.toast.deleteSuccess"));
        } catch (e: any) {
          toast.error(e?.message || "Error");
        }
      },
    });
  };

  const reorderItems = async (newOrder: CompanyService[]) => {
    try {
      const payload = newOrder
        .map((item, index) => ({
          id: item.id,
          orderIndex: index,
          originalOrderIndex: item.orderIndex,
        }))
        .filter((item) => item.orderIndex !== item.originalOrderIndex)
        .map(({ id, orderIndex }) => ({ id, orderIndex }));

      if (payload.length === 0) return;

      await servicesService.reorder(payload);

      // Invalidate to fetch fresh data
      await queryClient.invalidateQueries({ queryKey: ["services"] });

      toast.success(t("services.toast.reorderSuccess") || "Sắp xếp thành công");
    } catch (e: any) {
      toast.error(e?.message || "Error reordering");
    }
  };

  return {
    data,
    isFetching,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    mode,
    editingService,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    reorderItems,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
