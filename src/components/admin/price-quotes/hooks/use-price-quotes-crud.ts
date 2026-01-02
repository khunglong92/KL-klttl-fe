import { useState } from "react";
import { priceQuotesService } from "@/services/api/priceQuotesService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PriceQuote, PriceQuoteFormData } from "../types";

export function usePriceQuotesCrud() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingQuote, setEditingQuote] = useState<Partial<PriceQuote> | null>(
    null
  );
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Fetch quotes
  const { data: quotesData, isLoading } = useQuery({
    queryKey: ["admin-price-quotes", page, searchQuery],
    queryFn: async () => {
      const response = await priceQuotesService.getAll({
        page,
        perPage,
        search: searchQuery,
      });
      return response;
    },
    staleTime: 0,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: PriceQuoteFormData) => {
      return await priceQuotesService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-price-quotes"] });
      toast.success(
        t("priceQuotesAdmin.toast.createSuccess", "Tạo báo giá thành công")
      );
      closeForm();
    },
    onError: () => {
      toast.error(
        t("priceQuotesAdmin.toast.createError", "Lỗi khi tạo báo giá")
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
      data: PriceQuoteFormData;
    }) => {
      return await priceQuotesService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-price-quotes"] });
      toast.success(
        t("priceQuotesAdmin.toast.updateSuccess", "Cập nhật báo giá thành công")
      );
      closeForm();
    },
    onError: () => {
      toast.error(
        t("priceQuotesAdmin.toast.updateError", "Lỗi khi cập nhật báo giá")
      );
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await priceQuotesService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-price-quotes"] });
      toast.success(
        t("priceQuotesAdmin.toast.deleteSuccess", "Xóa báo giá thành công")
      );
    },
    onError: () => {
      toast.error(
        t("priceQuotesAdmin.toast.deleteError", "Lỗi khi xóa báo giá")
      );
    },
  });

  const openCreate = () => {
    setEditingQuote({});
    setMode("create");
  };

  const openEdit = (quote: PriceQuote) => {
    setEditingQuote(quote);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingQuote(null);
    setMode("list");
  };

  const onSubmit = async (formData: PriceQuoteFormData) => {
    if (editingQuote?.id) {
      await updateMutation.mutateAsync({ id: editingQuote.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const remove = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    data: quotesData,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    perPage,
    mode,
    editingQuote,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
