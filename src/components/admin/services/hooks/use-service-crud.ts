import { useState } from "react";
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

export function useServiceCrud() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingService, setEditingService] = useState<Partial<CompanyService> | null>(null);

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
  }

  const onSubmit = async (formData: ServiceFormData) => {
    try {
      if (editingService?.id) {
        await updateMutation.mutateAsync({ id: editingService.id, body: formData });
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

  const remove = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("services.toast.deleteSuccess"));
    } catch (e: any) {
      toast.error(e?.message || "Error");
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
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
