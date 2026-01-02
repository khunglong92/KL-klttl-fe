import { useState } from "react";
import { Title, Paper, TextInput, LoadingOverlay, Alert } from "@mantine/core";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useQuoteCrud } from "./hooks/use-quote-crud";
import { QuoteTable } from "./components/quote-table";
import { QuoteDetailDialog } from "./components/quote-detail-dialog";
import { Quote } from "@/services/api/quotesService";

export default function AdminQuotesPage() {
  const { t } = useTranslation();
  const {
    page,
    setPage,
    search,
    setSearch,
    quotesData,
    isLoading,
    isError,
    handleConfirmQuote,
    isUpdatingStatus,
    totalPages,
  } = useQuoteCrud();

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);

  const handleViewDetail = (quote: Quote) => {
    setSelectedQuote(quote);
    setDetailOpen(true);
  };

  return (
    <Paper shadow="md" p="lg" withBorder>
      <Title order={2} mb="lg">
        {t("quotes.title")}
      </Title>

      <TextInput
        placeholder={t("quotes.searchPlaceholder")}
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        mb="lg"
      />

      <div style={{ position: "relative" }}>
        <LoadingOverlay
          visible={isLoading || isUpdatingStatus}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        {isError ? (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            title={t("common.error")}
          >
            {t("quotes.error.load")}
          </Alert>
        ) : (
          <QuoteTable
            quotes={quotesData?.data || []}
            onViewDetail={handleViewDetail}
            onConfirm={handleConfirmQuote}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            limit={quotesData?.limit || 10}
            totalItems={quotesData?.total || 0}
          />
        )}
      </div>

      <QuoteDetailDialog
        opened={isDetailOpen}
        onClose={() => setDetailOpen(false)}
        quote={selectedQuote}
        onConfirm={(id) => {
          handleConfirmQuote(id);
          setDetailOpen(false); // Optionally close dialog after confirming
        }}
        isConfirming={isUpdatingStatus}
      />
    </Paper>
  );
}
