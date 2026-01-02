import { useState } from "react";
import { modals } from "@mantine/modals";
import { apiClient } from "@/services/api/base";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FormData, Project } from "../types";

interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  perPage: number;
}

export function useProjectCrud() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(
    null
  );
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch projects - only when projects tab is active
  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["admin-projects", page, searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsResponse>(
        `/projects?page=${page}&perPage=${perPage}`
      );
      return response;
    },
    enabled: mode === "list",
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post("/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success(t("projectsAdmin.toast.createProjectSuccess"));
      closeForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || t("projectsAdmin.toast.saveProjectError"));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      return await apiClient.patch(`/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success(t("projectsAdmin.toast.updateProjectSuccess"));
      closeForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || t("projectsAdmin.toast.saveProjectError"));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success(t("projectsAdmin.toast.deleteProjectSuccess"));
    },
    onError: (error: any) => {
      toast.error(
        error?.message || t("projectsAdmin.toast.deleteProjectError")
      );
    },
  });

  const openCreate = () => {
    setEditingProject({});
    setMode("create");
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingProject(null);
    setMode("list");
  };

  const onSubmit = async (formData: FormData) => {
    if (editingProject?.id) {
      await updateMutation.mutateAsync({
        id: editingProject.id,
        data: formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const remove = (id: string) => {
    modals.openConfirmModal({
      title: t("projectsAdmin.deleteConfirmTitle") || "Xác nhận xóa dự án",
      children:
        t("projectsAdmin.deleteConfirmMessage") ||
        "Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.",
      centered: true,
      labels: {
        confirm: t("common.delete") || "Xóa",
        cancel: t("common.cancel") || "Hủy",
      },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await deleteMutation.mutateAsync(id);
      },
    });
  };

  return {
    data: projectsData,
    isLoading: isLoadingProjects,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    mode,
    editingProject,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
