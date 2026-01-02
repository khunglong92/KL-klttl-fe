import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { News, NewsFormData } from "../types";
import { v4 as uuidv4 } from "uuid";

import { getKeyFromUrl, uploadService } from "@/services/api/uploadService";

interface UseNewsFormProps {
  news?: Partial<News> | null;
  onSubmit: (data: NewsFormData) => Promise<void>;
}

export interface ImageFile {
  file: File | null;
  url: string | null;
}

export function useNewsForm({ news, onSubmit }: UseNewsFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Stable ID for uploads
  const [generatedId] = useState(() => uuidv4());
  const newsId = news?.id || generatedId;

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
  } = useForm<NewsFormData>({
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

  // Helper to check if URL is a server image (not blob)
  const isServerImage = (url?: string | null): boolean => {
    return !!url && !url.startsWith("blob:");
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
      if (news) {
        // Load section contents if they are keys
        const processedSections = await Promise.all(
          (news.contentSections || []).map(async (section) => {
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
          title: news.title || "",
          subtitle: news.subtitle || "",
          image: news.image || "",
          contentSections: processedSections,
          isFeatured: news.isFeatured ?? false,
          isActive: news.isActive ?? true,
        });

        // Set initial preview for main image if exists
        if (news.image) {
          setMainImageFile({ file: null, url: news.image });
        }
        // Reset deleted images
        setDeletedImageUrls([]);
      }
    };

    loadForm();
  }, [news, reset]);

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
    if (isServerImage(currentUrl)) {
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

  const submitForm = async (data: NewsFormData) => {
    try {
      setIsLoading(true);

      // 1. Upload Main Image
      let mainImageUrl = data.image;
      if (mainImageFile?.file) {
        toast.loading(
          t("newsAdmin.form.toast.uploadingMain", "Đang tải ảnh bìa..."),
          {
            id: "upload-main",
          }
        );
        const res = await uploadService.uploadImage(
          mainImageFile.file,
          `news/${newsId}/images`
        );
        if (res?.public_id) {
          mainImageUrl = res.public_id;
        }
        toast.dismiss("upload-main");
      }

      // 2. Process Sections (Upload HTML content)
      toast.loading("Đang xử lý nội dung...", { id: "process-content" });

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
              `news/${newsId}/sections`,
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

      const finalData: NewsFormData = {
        ...data,
        image: mainImageUrl,
        contentSections: processedSections,
      };

      const payload = {
        ...finalData,
        id: newsId,
        deletedImages: deletedImageUrls,
      };

      await onSubmit(payload as any);

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
    newsId,
    setValue,
    watch,

    // Handlers
    handleRemoveSection,
  };
}
