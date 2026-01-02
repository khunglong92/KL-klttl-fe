import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quotesService, CreateQuoteDto } from "@/services/api/quotesService";
import { uploadService } from "@/services/api/uploadService";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/api/queryKeys";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface QuoteFormData {
  // Customer Information
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  title?: string;

  // Project Information
  projectName: string;
  projectType: string;
  projectDescription: string;
  budget?: string;
  expectedCompletion?: string;

  // Technical Requirements
  technicalRequirements?: string;
  attachments?: string;

  // Additional Information
  subject?: string;
  content: string;
}

export interface QuoteSubmissionData extends QuoteFormData {
  file?: File | null;
}

export const useQuote = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const createQuote = useMutation({
    mutationFn: async (data: QuoteSubmissionData) => {
      let attachmentUrl = data.attachments;

      // Upload file first if exists
      if (data.file) {
        try {
          setUploadStatus("uploading");
          setUploadProgress(0);

          const folder = `uploads/quote/${uuidv4()}`;

          // Simulate progress (since we don't have real progress from API)
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 200);

          const uploadResponse = await uploadService.uploadQuoteFile(
            data.file,
            folder
          );

          clearInterval(progressInterval);
          setUploadProgress(100);
          setUploadStatus("success");

          attachmentUrl = uploadResponse.url;
        } catch (error: any) {
          setUploadStatus("error");
          throw new Error(
            error?.response?.data?.message ||
              "Tải file lên thất bại. Vui lòng thử lại."
          );
        }
      }

      // Map quote data to CreateQuoteDto
      const quoteDto: CreateQuoteDto = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        title: data.title,
        projectName: data.projectName,
        projectType: data.projectType,
        projectDescription: data.projectDescription,
        budget: data.budget,
        expectedCompletion: data.expectedCompletion,
        technicalRequirements: data.technicalRequirements,
        attachmentUrl: attachmentUrl,
        subject: data.subject || `Báo giá - ${data.projectName}`,
        content: data.content,
      };

      return quotesService.create(quoteDto);
    },
    onSuccess: () => {
      toast.success(t("quoteForm.success"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.quotes.root] });
      setUploadStatus("idle");
      setUploadProgress(0);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        t("quoteForm.error");
      toast.error(errorMessage);
      setUploadStatus("error");
    },
  });

  return {
    createQuote: createQuote.mutate,
    isSubmitting: createQuote.isPending,
    uploadProgress,
    uploadStatus,
  };
};
