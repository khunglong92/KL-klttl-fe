import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PriceQuote, PriceQuoteFormData } from "../types";
import { v4 as uuidv4 } from "uuid";
import { getKeyFromUrl, uploadService } from "@/services/api/uploadService";

interface UsePriceQuotesFormProps {
  quote?: Partial<PriceQuote> | null;
  onSubmit: (data: PriceQuoteFormData) => Promise<void>;
}

export interface ImageFile {
  file: File | null;
  url: string | null;
}

export function usePriceQuotesForm({
  quote,
  onSubmit,
}: UsePriceQuotesFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Generate ID for new quote to use in MinIO paths
  // If editing, use existing ID.
  const [generatedId] = useState(() => uuidv4());
  const quoteId = quote?.id || generatedId;

  // Track deleted images (only main image now)
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
    reset,
  } = useForm<PriceQuoteFormData>({
    defaultValues: {
      title: "",
      subtitle: "",
      image: "",
      contentSections: [],
      isFeatured: false,
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contentSections",
  });

  // State for main image file
  const [mainImageFile, setMainImageFile] = useState<ImageFile | null>(null);

  // Helper to check if URL is from our server (MinIO/Local)
  const isServerImage = (url?: string) => {
    if (!url) return false;
    return !url.startsWith("blob:");
  };

  // Helper: Fetch content from URL/Key
  const fetchContent = async (contentOrKey: string) => {
    if (!contentOrKey) return "";
    // If it looks like HTML (starts with <), return as is
    if (contentOrKey.trim().startsWith("<")) return contentOrKey;

    try {
      let url = contentOrKey;
      if (!url.startsWith("http")) {
        url = await uploadService.getFileUrl(contentOrKey);
      }
      const res = await fetch(url);
      if (res.ok) {
        return await res.text();
      }
    } catch (error) {
      console.warn("Failed to load content:", error);
    }
    return contentOrKey;
  };

  useEffect(() => {
    const loadForm = async () => {
      if (quote) {
        // Load section contents if they are keys
        const processedSections = await Promise.all(
          (quote.contentSections || []).map(async (section) => {
            // Store the original key if it looks like a key (not HTML)
            const isKey =
              section.description &&
              !section.description.trim().startsWith("<") &&
              !section.description.startsWith("http");

            const originalKey = isKey ? section.description : undefined;
            const richDescription = await fetchContent(section.description);

            return {
              ...section,
              description: richDescription,
              _originalKey: originalKey, // Store hidden property
            };
          })
        );

        reset({
          title: quote.title || "",
          subtitle: quote.subtitle || "",
          image: quote.image || "",
          contentSections: processedSections,
          isFeatured: quote.isFeatured ?? false,
          isActive: quote.isActive ?? true,
        });

        // Set initial preview for main image if exists
        if (quote.image) {
          setMainImageFile({ file: null, url: quote.image });
        }
        // Reset deleted images
        setDeletedImageUrls([]);
      }
    };

    loadForm();
  }, [quote, reset]);

  // Track old image for deletion when changing main image
  const handleMainImageChange = (file: File | null) => {
    const currentUrl = getValues("image");
    if (isServerImage(currentUrl)) {
      setDeletedImageUrls((prev) => [...prev, getKeyFromUrl(currentUrl!)]);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setMainImageFile({ file, url });
    } else {
      setMainImageFile(null);
    }
  };

  const handleRemoveMainImage = () => {
    const currentUrl = mainImageFile?.url;
    if (isServerImage(currentUrl || "")) {
      setDeletedImageUrls((prev) => [...prev, getKeyFromUrl(currentUrl!)]);
    }
    setMainImageFile(null);
    setValue("image", "");
  };

  const handleRemoveSection = (index: number) => {
    // We don't track section images anymore as separate fields
    // But if we wanted to cleanup orphaned content files, we could track description keys here
    // However, description loaded into form is HTML, not key. We lost the key.
    // So we assume backend handles or we ignore orphans for now.
    remove(index);
  };

  const submitForm = async (data: PriceQuoteFormData) => {
    try {
      setIsLoading(true);

      // 1. Upload Main Image
      let mainImageUrl = data.image;
      if (mainImageFile?.file) {
        toast.loading(t("common.uploading", "Đang tải ảnh..."), {
          id: "upload-main",
        });
        const res = await uploadService.uploadToMinio(
          mainImageFile.file,
          `price-quotes/${quoteId}/images`,
          {
            isDetailedDescription: false,
          }
        );

        if (res?.public_id) {
          mainImageUrl = res.public_id;
        }
        toast.dismiss("upload-main");
      }

      // 2. Process Sections (Upload HTML content)
      toast.loading(t("common.processing", "Đang xử lý nội dung..."), {
        id: "process-content",
      });

      const processedSections = await Promise.all(
        data.contentSections.map(async (section: any) => {
          let descriptionKey = section.description;

          // If description has content, upload it as file
          if (section.description && section.description.length > 0) {
            const blob = new Blob([section.description], { type: "text/html" });

            let customKey: string | undefined = undefined;
            let filename = `section_${uuidv4()}.html`;

            if (section._originalKey) {
              customKey = section._originalKey;
              // If overriding, we don't strictly need filename to match, but good practice
              const parts = section._originalKey.split("/");
              const existingName = parts[parts.length - 1];
              if (existingName) filename = existingName;
            }

            const file = new File([blob], filename, { type: "text/html" });

            // Use uploadToMinio directly to support customKey (overwrite)
            const res = await uploadService.uploadToMinio(
              file,
              `price-quotes/${quoteId}/sections`,
              {
                customKey,
                isDetailedDescription: true,
              }
            );

            descriptionKey = res.public_id;
          }

          const { _originalKey, ...restSection } = section; // Remove internal prop

          return {
            ...restSection,
            description: descriptionKey,
            image: "", // Clear image field as we removed it
          };
        })
      );

      toast.dismiss("process-content");

      const finalData: any = {
        ...data,
        id: quoteId,
        image: mainImageUrl,
        contentSections: processedSections,
        deletedImages: deletedImageUrls,
      };

      await onSubmit(finalData);

      // Cleanup
      setDeletedImageUrls([]);
    } catch (error) {
      console.error(error);
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    control,
    handleSubmit: handleSubmit(submitForm),
    errors,
    isLoading,
    fields,
    append,
    remove,

    // Main Image
    mainImageFile,
    handleMainImageChange,
    handleRemoveMainImage,

    // Deletion
    deletedImageUrls,
    quoteId,
    setValue,
    watch,

    // Handlers
    handleRemoveSection,
  };
}
