import { useState } from "react";
import { apiClient } from "@/services/api/base";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Recruitment,
  RecruitmentFormData,
  RecruitmentResponse,
} from "../types";

export function useRecruitmentCrud() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingRecruitment, setEditingRecruitment] =
    useState<Partial<Recruitment> | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch recruitment
  const { data: recruitmentData, isLoading } = useQuery({
    queryKey: ["admin-recruitment", page, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
      });
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const response = await apiClient.get<RecruitmentResponse>(
        `/recruitment?${params.toString()}`
      );
      return response;
    },
    staleTime: 0,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: RecruitmentFormData) => {
      return await apiClient.post("/recruitment", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recruitment"] });
      toast.success(
        t(
          "recruitmentAdmin.toast.createSuccess",
          "Tạo tin tuyển dụng thành công"
        )
      );
      closeForm();
    },
    onError: () => {
      toast.error(
        t("recruitmentAdmin.toast.createError", "Lỗi khi tạo tin tuyển dụng")
      );
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: RecruitmentFormData;
    }) => {
      return await apiClient.patch(`/recruitment/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recruitment"] });
      toast.success(
        t(
          "recruitmentAdmin.toast.updateSuccess",
          "Cập nhật tin tuyển dụng thành công"
        )
      );
      closeForm();
    },
    onError: () => {
      toast.error(
        t(
          "recruitmentAdmin.toast.updateError",
          "Lỗi khi cập nhật tin tuyển dụng"
        )
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/recruitment/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recruitment"] });
      toast.success(
        t(
          "recruitmentAdmin.toast.deleteSuccess",
          "Xóa tin tuyển dụng thành công"
        )
      );
    },
    onError: () => {
      toast.error(
        t("recruitmentAdmin.toast.deleteError", "Lỗi khi xóa tin tuyển dụng")
      );
    },
  });

  const openCreate = () => {
    setEditingRecruitment({});
    setMode("create");
  };

  const openEdit = (recruitment: Recruitment) => {
    setEditingRecruitment(recruitment);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingRecruitment(null);
    setMode("list");
  };

  const onSubmit = async (formData: RecruitmentFormData) => {
    if (editingRecruitment?.id) {
      await updateMutation.mutateAsync({
        id: editingRecruitment.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const remove = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    data: recruitmentData,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    mode,
    editingRecruitment,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
