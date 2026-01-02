import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  contactsService,
  CreateContactDto,
  UpdateContactDto,
} from "@/services/api/contactsService";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

/**
 * Custom hook for fetching a paginated list of contacts.
 */
export const useContacts = (page: number, limit: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.contacts.root, page, limit],
    queryFn: () => contactsService.findAll(page, limit),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Custom hook for creating a new contact.
 */
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactDto) => contactsService.create(data),
    onSuccess: () => {
      toast.success("Tin nhắn của bạn đã được gửi thành công!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.contacts.root] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Gửi tin nhắn thất bại. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Custom hook for updating a contact's status.
 */
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactDto }) =>
      contactsService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.contacts.root] });
    },
  });
};

/**
 * Custom hook for deleting a contact.
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.contacts.root] });
    },
  });
};
