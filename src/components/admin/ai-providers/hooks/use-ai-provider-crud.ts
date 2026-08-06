import { useState } from "react";
import { modals } from "@mantine/modals";
import { toast } from "sonner";
import {
  useAiProviders,
  useCreateAiProvider,
  useUpdateAiProvider,
  useDeleteAiProvider,
  useActivateAiProvider,
  useTestAiProvider,
  useTestDraftAiProvider,
} from "@/services/hooks/useAiChat";
import type {
  ProviderProfile,
  TestConnectionResult,
  UpsertProviderDto,
} from "@/services/api/aiChatService";

export function useAiProviderCrud() {
  const { data: providers, isFetching } = useAiProviders();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingProvider, setEditingProvider] =
    useState<ProviderProfile | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, TestConnectionResult>
  >({});

  const createMutation = useCreateAiProvider();
  const updateMutation = useUpdateAiProvider();
  const deleteMutation = useDeleteAiProvider();
  const activateMutation = useActivateAiProvider();
  const testSavedMutation = useTestAiProvider();
  const testDraftMutation = useTestDraftAiProvider();

  const openCreate = () => {
    setEditingProvider(null);
    setMode("create");
  };

  const openEdit = (provider: ProviderProfile) => {
    setEditingProvider(provider);
    setMode("edit");
  };

  const closeForm = () => {
    setEditingProvider(null);
    setMode("list");
  };

  const onSubmit = async (formData: UpsertProviderDto) => {
    try {
      if (editingProvider?.id) {
        await updateMutation.mutateAsync({
          id: editingProvider.id,
          body: formData,
        });
        toast.success("Cập nhật cấu hình thành công!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Tạo cấu hình thành công!");
      }
      closeForm();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
      throw e;
    }
  };

  const remove = (id: string) => {
    modals.openConfirmModal({
      title: "Xác nhận xoá cấu hình",
      children:
        "Bạn có chắc chắn muốn xoá cấu hình nhà cung cấp AI này? Hành động này không thể hoàn tác.",
      centered: true,
      labels: { confirm: "Xoá", cancel: "Huỷ" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(id);
          toast.success("Xoá cấu hình thành công!");
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
        }
      },
    });
  };

  const activate = async (id: string) => {
    try {
      await activateMutation.mutateAsync(id);
      toast.success("Đã kích hoạt cấu hình này!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Có lỗi xảy ra");
    }
  };

  const testSaved = async (id: string) => {
    try {
      const result = await testSavedMutation.mutateAsync(id);
      setTestResults((prev) => ({ ...prev, [id]: result }));
    } catch (e) {
      setTestResults((prev) => ({
        ...prev,
        [id]: {
          ok: false,
          message: e instanceof Error ? e.message : "Có lỗi xảy ra",
        },
      }));
    }
  };

  const testDraft = async (draft: {
    baseUrl: string;
    apiKey?: string;
    model: string;
  }): Promise<TestConnectionResult> => {
    return testDraftMutation.mutateAsync(draft);
  };

  return {
    providers,
    isFetching,
    mode,
    editingProvider,
    testResults,
    openCreate,
    openEdit,
    closeForm,
    onSubmit,
    remove,
    activate,
    testSaved,
    testDraft,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isTestingDraft: testDraftMutation.isPending,
  };
}
