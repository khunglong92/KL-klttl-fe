import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Recruitment, RecruitmentFormData } from "../types";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";
import { v4 as uuidv4 } from "uuid";

// Helper to check if URL is from our server (MinIO/Local)
const isServerImage = (url?: string) => {
  if (!url) return false;
  return !url.startsWith("blob:");
};

// Helper to fetch content from URL/Key
const fetchContent = async (contentOrKey: string) => {
  if (!contentOrKey) return "";

  // If it starts with <, assume it's already HTML content
  if (contentOrKey.trim().startsWith("<")) return contentOrKey;

  try {
    // If it's a key/url, try to fetch it
    let url = contentOrKey;
    if (!url.startsWith("http")) {
      url = await uploadService.getFileUrl(contentOrKey);
    }

    const res = await fetch(url);
    if (!res.ok) return contentOrKey; // Fallback to key if fetch fails
    return await res.text();
  } catch (error) {
    console.error("Error fetching content:", error);
    return contentOrKey;
  }
};

interface UseRecruitmentFormProps {
  recruitment?: Partial<Recruitment>;
  onSubmit: (data: RecruitmentFormData) => Promise<void>;
}

export function useRecruitmentForm({
  recruitment,
  onSubmit,
}: UseRecruitmentFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Local state for main image preview/file
  const [mainImageFile, setMainImageFile] = useState<{
    file: File | null;
    url: string;
  } | null>(null);

  // Track deleted images to cleanup on server
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  // Generate ID for new recruitment to use in MinIO paths
  // If editing, use existing ID.
  const [generatedId] = useState(() => uuidv4());
  const recruitmentId = recruitment?.id || generatedId;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<RecruitmentFormData>({
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

  useEffect(() => {
    const loadForm = async () => {
      if (recruitment) {
        // Load section contents if they are keys
        const processedSections = await Promise.all(
          (recruitment.contentSections || []).map(async (section) => {
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
          title: recruitment.title || "",
          subtitle: recruitment.subtitle || "",
          image: recruitment.image || "",
          contentSections: processedSections,
          isFeatured: recruitment.isFeatured ?? false,
          isActive: recruitment.isActive ?? true,
        });

        if (recruitment.image) {
          setMainImageFile({ file: null, url: recruitment.image });
        }
        setDeletedImageUrls([]);
      }
    };

    loadForm();
  }, [recruitment, reset]);

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
    remove(index);
  };

  const submitForm = async (data: RecruitmentFormData) => {
    try {
      setIsLoading(true);

      // 1. Upload Main Image
      let mainImageUrl = data.image;
      if (mainImageFile?.file) {
        toast.loading(
          t("recruitmentAdmin.form.toast.uploadingMain", "Đang tải ảnh bìa..."),
          {
            id: "upload-main",
          }
        );
        const res = await uploadService.uploadImage(
          mainImageFile.file,
          `recruitment/${recruitmentId}/images`
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

          if (section.description && section.description.length > 0) {
            const blob = new Blob([section.description], { type: "text/html" });

            let customKey: string | undefined = undefined;
            let filename = `section_${uuidv4()}.html`;

            if (section._originalKey) {
              customKey = section._originalKey;
              const parts = section._originalKey.split("/");
              const existingName = parts[parts.length - 1];
              if (existingName) filename = existingName;
            }

            const file = new File([blob], filename, { type: "text/html" });

            const res = await uploadService.uploadToMinio(
              file,
              `recruitment/${recruitmentId}/sections`,
              {
                customKey,
                isDetailedDescription: true,
              }
            );
            descriptionKey = res.public_id;
          }

          const { _originalKey, ...restSection } = section;

          return {
            ...restSection,
            description: descriptionKey,
            image: "", // Clear image field
          };
        })
      );

      toast.dismiss("process-content");

      const finalData: any = {
        ...data,
        id: recruitmentId, // Pass ID if new (frontend generated)
        image: mainImageUrl,
        contentSections: processedSections,
        deletedImages: deletedImageUrls, // Pass deleted images to backend
      };

      await onSubmit(finalData);
    } catch (error) {
      console.error("Error submit form:", error);
      toast.error(t("common.error", "Có lỗi xảy ra"));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(submitForm),
    errors,
    isLoading,
    fields,
    append,
    control,
    mainImageFile,
    handleMainImageChange,
    handleRemoveMainImage,
    handleRemoveSection,
    watch,
  };
}
