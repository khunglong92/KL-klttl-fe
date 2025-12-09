import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  quotesService,
  CreateQuoteDto,
  UpdateQuoteDto,
} from "@/services/api/quotesService";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/api/queryKeys";

/**
 * Custom hook for fetching a paginated list of quotes.
 */
export const useQuotes = (page: number, limit: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.quotes.root, page, limit],
    queryFn: () => quotesService.findAll(page, limit),
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Custom hook for fetching a single quote by ID.
 */
export const useQuote = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.quotes.byId(id),
    queryFn: () => quotesService.findOne(id),
    enabled: !!id,
  });
};

/**
 * Custom hook for creating a new quote.
 */
export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuoteDto) => quotesService.create(data),
    onSuccess: () => {
      toast.success("Yêu cầu báo giá của bạn đã được gửi thành công!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.quotes.root] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Gửi yêu cầu báo giá thất bại. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    },
  });
};

/**
 * Custom hook for updating a quote's status.
 */
export const useUpdateQuoteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuoteDto }) =>
      quotesService.updateStatus(id, data),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.quotes.root] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Cập nhật trạng thái thất bại. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    },
  });
};

