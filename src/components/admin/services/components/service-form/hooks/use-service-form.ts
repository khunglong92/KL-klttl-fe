import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { toast } from "sonner";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";
import { CompanyService, ServiceStatus } from "@/services/api/servicesService";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const createServiceFormSchema = (t: any) =>
  z.object({
    id: z.string().uuid(),
    name: z.string().min(1, t("validation.nameRequired")),
    short_description: z
      .string()
      .min(1, t("validation.shortDescriptionRequired")),
    detailed_description: z.string().optional(),
    hashtags: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    is_featured: z.boolean(),
    status: z.nativeEnum(ServiceStatus),
  });

export type ServiceFormData = z.infer<
  ReturnType<typeof createServiceFormSchema>
>;

export function useServiceForm(params: {
  isEditing: boolean;
  form: Partial<CompanyService>;
  onSubmit: (finalForm: any) => Promise<void>;
}) {
  const { form, onSubmit } = params;
  const { t } = useTranslation();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceFormSchema = createServiceFormSchema(t);

  // Resolve image keys to displayable URLs
  const resolveImageUrls = useCallback(
    async (keys: string[]): Promise<string[]> => {
      try {
        const urls = await uploadService.getMultipleFileUrls(keys);
        return keys.map((key) => urls[key] || key);
      } catch (error) {
        console.warn("Failed to resolve image URLs:", error);
        return keys;
      }
    },
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onTouched",
    defaultValues: {
      id: form.id || uuidv4(),
      name: form.name || "",
      short_description: form.shortDescription || "",
      detailed_description: form.detailedDescription || "",
      hashtags: form.hashtags || [],
      // hashtags removed
      images: form.images || [],
      is_featured: form.isFeatured || false,
      status: form.status || ServiceStatus.PUBLISHED,
    },
  });

  useEffect(() => {
    const loadForm = async () => {
      let detailedDescContent = form.detailedDescription || "";

      // Attempts to fetch content if it looks like a URL or file key
      if (
        detailedDescContent &&
        (detailedDescContent.startsWith("http") ||
          detailedDescContent.includes("/"))
      ) {
        try {
          let url = detailedDescContent;
          // If it's a key (not http), resolve to presigned URL
          if (!url.startsWith("http")) {
            url = await uploadService.getFileUrl(detailedDescContent);
          }

          const res = await fetch(url);
          if (res.ok) {
            detailedDescContent = await res.text();
          }
        } catch (error) {
          console.warn("Failed to load detailed description content:", error);
          // Fallback: keep original value (might be the key) or empty
        }
      }

      reset({
        id: form.id || uuidv4(),
        name: form.name || "",
        short_description: form.shortDescription || "",
        detailed_description: detailedDescContent,
        hashtags: form.hashtags || [],
        images: form.images || [],
        is_featured: form.isFeatured || false,
        status: form.status || ServiceStatus.PUBLISHED,
      });

      // Resolve keys to presigned URLs for display
      if (form.images && form.images.length > 0) {
        const resolvedUrls = await resolveImageUrls(form.images);
        setPreviewUrls(resolvedUrls);
      } else {
        setPreviewUrls([]);
      }
      setPendingFiles([]);
    };

    loadForm();
  }, [JSON.stringify(form), reset, resolveImageUrls]);

  const handleImageSelect = (files: File[]) => {
    if (!files || files.length === 0) return;

    const totalCount =
      (watch("images")?.length || 0) + pendingFiles.length + files.length;
    if (totalCount > 10) {
      notifications.show({
        color: "red",
        message: t("validation.maxImages", { count: 10 }),
      });
      return;
    }

    const invalidFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      notifications.show({
        color: "red",
        message: t("validation.imageTooLarge", { count: invalidFiles.length }),
      });
      return;
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPendingFiles((prev) => [...prev, ...files]);
    setPreviewUrls(() => [...previewUrls, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const existingImages = watch("images") || [];
    const existingImagesCount = existingImages.length;

    if (index < existingImagesCount) {
      // Deleting existing image
      const imageToRemove = existingImages[index];
      if (imageToRemove) {
        // Extract key from URL
        const key = getKeyFromUrl(imageToRemove);
        setDeletedImageUrls((prev) => [...prev, key]);
      }

      const newImages = [...existingImages];
      newImages.splice(index, 1);
      setValue("images", newImages, { shouldValidate: true });

      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    } else {
      // Deleting pending image
      const pendingIndex = index - existingImagesCount;
      const newPendingFiles = [...pendingFiles];
      newPendingFiles.splice(pendingIndex, 1);
      setPendingFiles(newPendingFiles);

      const newPreviewUrls = [...previewUrls];
      const urlToRevoke = newPreviewUrls[index];
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const onSubmitError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      notifications.show({
        color: "red",
        title: t("validation.error"),
        message: firstError.message as string,
      });
    }
  };

  const handleFormSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    // Manual validation for at least one image if required
    const totalImages = (data.images?.length || 0) + pendingFiles.length;
    if (totalImages === 0) {
      notifications.show({
        color: "red",
        title: t("validation.error"),
        message: t("validation.imagesRequired"),
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // 2. Upload new images
      let finalImageKeys = (data.images || []).map((k) => getKeyFromUrl(k));

      if (pendingFiles.length > 0) {
        toast.loading(
          t("serviceForm.uploading", { count: pendingFiles.length }),
          {
            id: "upload-service-images",
          }
        );
        const uploadPromises = pendingFiles.map((file) =>
          uploadService.uploadImage(file, `services/${data.id}`)
        );
        const uploadedResults = await Promise.all(uploadPromises);
        const newImageKeys = uploadedResults.map((res) => res.public_id);
        finalImageKeys = [...finalImageKeys, ...newImageKeys];
        toast.dismiss("upload-service-images");
      }

      let detailedDescriptionKey = data.detailed_description;

      // If content changed or is new, upload it as a file
      if (data.detailed_description && data.detailed_description.length > 0) {
        const blob = new Blob([data.detailed_description], {
          type: "text/html",
        });
        const file = new File([blob], "detailed_description.html", {
          type: "text/html",
        });
        toast.loading("Uploading description...", { id: "upload-desc" });
        const res = await uploadService.uploadImage(
          file,
          `services/${data.id}`
        );
        detailedDescriptionKey = res.public_id;
        toast.dismiss("upload-desc");
      }

      // 3. Prepare Final Data
      // Map form fields to DTO fields
      const finalData = {
        id: data.id,
        name: data.name, // Mapped from title
        shortDescription: data.short_description,
        detailedDescription: detailedDescriptionKey,
        hashtags: data.hashtags || [],
        images: finalImageKeys,
        isFeatured: data.is_featured,
        status: data.status,
        deletedImages: deletedImageUrls, // Pass this if DTO supports it for cleanup
      };

      setPendingFiles([]);
      await onSubmit(finalData);

      setDeletedImageUrls([]);
    } catch (e: any) {
      toast.error(e?.message || t("serviceForm.uploadError"));
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormState = async () => {
    setDeletedImageUrls([]);
    setPendingFiles([]);

    if (form.images && form.images.length > 0) {
      const resolvedUrls = await resolveImageUrls(form.images);
      setPreviewUrls(resolvedUrls);
    } else {
      setPreviewUrls([]);
    }

    reset({
      id: form.id || uuidv4(),
      name: form.name || "",
      short_description: form.shortDescription || "",
      detailed_description: form.detailedDescription || "",
      hashtags: form.hashtags || [],
      // hashtags removed
      images: form.images || [],
      is_featured: form.isFeatured || false,
      status: form.status || ServiceStatus.PUBLISHED,
    });
  };

  return {
    register,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
    handleImageSelect,
    handleRemoveImage,
    previewUrls,
    pendingFiles,
    isSubmitting,
    onSubmitForm: handleSubmit(handleFormSubmit, onSubmitError),
    resetFormState,
    deletedImageUrls,
  };
}
