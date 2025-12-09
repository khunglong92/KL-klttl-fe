import { useState } from "react";
import {
  useContacts,
  useUpdateContactStatus,
  useDeleteContact,
} from "@/services/hooks/useContacts";
import type { Contact } from "@/services/api/contactsService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useContactCrud() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

  const { data, isFetching } = useContacts(page, limit);
  const updateConfirmationMutation = useUpdateContactStatus();
  const deleteMutation = useDeleteContact();

  const openDetail = (contact: Contact) => {
    setSelected(contact);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelected(null);
    setIsDetailOpen(false);
  };

  const confirm = async (id: string) => {
    try {
      await updateConfirmationMutation.mutateAsync({
        id,
        data: { isConfirmed: "confirmed" },
      });
      toast.success(t("contacts.toast.confirmSuccess"));
    } catch (e: any) {
      toast.error(e?.message || "Error");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(t("contacts.toast.deleteSuccess"));
    } catch (e: any) {
      toast.error(e?.message || "Error");
    }
  };

  return {
    // data
    items: data?.data ?? [],
    total: data?.total ?? 0,
    isFetching,
    // pagination
    page,
    setPage,
    limit,
    setLimit,
    // detail view
    isDetailOpen,
    selected,
    openDetail,
    closeDetail,
    // actions
    confirm,
    remove,
    isSaving: updateConfirmationMutation.isPending || deleteMutation.isPending,
  };
}
