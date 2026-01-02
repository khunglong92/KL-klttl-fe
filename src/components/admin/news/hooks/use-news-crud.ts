import { useState } from "react";
import { apiClient } from "@/services/api/base";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { News, NewsFormData, NewsResponse } from "../types";

export function useNewsCrud() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingNews, setEditingNews] = useState<Partial<News> | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch news
  const { data: newsData, isLoading } = useQuery({
    queryKey: ["admin-news", page, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
      });
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const response = await apiClient.get<NewsResponse>(
        `/news?${params.toString()}`
      );
      return response;
    },
    staleTime: 0,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      return await apiClient.post("/news", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast.success(
        t("newsAdmin.toast.createSuccess", "Tạo tin tức thành công")
      );
      closeForm();
    },
    onError: () => {
      toast.error(t("newsAdmin.toast.createError", "Lỗi khi tạo tin tức"));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: NewsFormData & { deletedImages?: string[] };
    }) => {
      // Ensure deletedImages is included in the payload
      return await apiClient.patch(`/news/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast.success(
        t("newsAdmin.toast.updateSuccess", "Cập nhật tin tức thành công")
      );
      closeForm();
    },
    onError: () => {
      toast.error(t("newsAdmin.toast.updateError", "Lỗi khi cập nhật tin tức"));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast.success(
        t("newsAdmin.toast.deleteSuccess", "Xóa tin tức thành công")
      );
    },
    onError: () => {
      toast.error(t("newsAdmin.toast.deleteError", "Lỗi khi xóa tin tức"));
    },
  });

  const openCreate = () => {
    setEditingNews({});
    setMode("create");
  };

  const openEdit = (news: News) => {
    setEditingNews(news);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingNews(null);
    setMode("list");
  };

  const onSubmit = async (formData: NewsFormData) => {
    // formData here comes from useNewsForm's submitForm which includes { ...data, id, deletedImages }
    // We need to cast it or update the type in arguments to allow deletedImages
    const payload = formData as NewsFormData & { deletedImages?: string[] };

    if (editingNews?.id) {
      await updateMutation.mutateAsync({
        id: editingNews.id,
        data: payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const remove = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    data: newsData,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    mode,
    editingNews,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
