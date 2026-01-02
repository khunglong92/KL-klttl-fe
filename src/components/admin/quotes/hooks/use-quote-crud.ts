import { useMemo, useState } from "react";
import { useQuotes, useUpdateQuoteStatus } from "@/services/hooks/useQuotes";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const useQuoteCrud = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const {
    data: quotesData,
    isLoading,
    isError,
    refetch,
  } = useQuotes(page, limit);

  const updateStatusMutation = useUpdateQuoteStatus();

  const handleConfirmQuote = (id: string) => {
    updateStatusMutation.mutate(
      { id, data: { isConfirmed: "confirmed" } },
      {
        onSuccess: () => {
          toast.success(t("quotes.toast.confirmSuccess"));
          refetch();
        },
        onError: () => {
          toast.error(t("quotes.toast.confirmError"));
        },
      }
    );
  };

  const totalPages = useMemo(() => {
    return quotesData ? Math.ceil(quotesData.total / limit) : 0;
  }, [quotesData, limit]);

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    quotesData,
    isLoading,
    isError,
    refetch,
    handleConfirmQuote,
    isUpdatingStatus: updateStatusMutation.isPending,
    totalPages,
  };
};
