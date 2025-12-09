import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { toast } from "sonner";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";
import {
  CompanyService,
  ServiceStatus,
  ThemeVariant,
} from "@/services/api/servicesService";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const arrayToHtmlList = (data: string[] | string | undefined): string => {
  if (!data) return "";

  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    return `<ul>${data.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  if (typeof data === "string") {
    // Check if it's a JSON string representing an array
    if (data.startsWith("[") && data.endsWith("]")) {
      try {
        const items = JSON.parse(data);
        if (Array.isArray(items) && items.length > 0) {
          return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
        }
        return ""; // It was an empty JSON array '[]'
      } catch {
        // Not a valid JSON array string, so treat as raw HTML
        return data;
      }
    }
    // It's not a JSON array string, so it must be raw HTML
    return data;
  }

  return "";
};

const createServiceFormSchema = (t: any) =>
  z.object({
    id: z.string().uuid(),
    slug: z.string().min(1, t("validation.slugRequired")),
    title: z.string().min(1, t("validation.titleRequired")),
    subtitle: z.string().optional(),
    short_description: z
      .string()
      .min(1, t("validation.shortDescriptionRequired")),
    content: z.string().optional(),
    features: z.string().optional(),
    technologies: z.string().optional(),
    benefits: z.string().optional(),
    customers: z.string().optional(),
    image_urls: z.array(z.string()).optional(),
    icon: z.string().optional(),
    cta_label: z.string().optional(),
    cta_link: z.string().min(1, t("validation.ctaLinkRequired")),
    order_index: z.number().optional(),
    tags: z.array(z.string()).optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    alt_text: z.string().optional(),
    status: z.enum([
      ServiceStatus.DRAFT,
      ServiceStatus.PUBLISHED,
      ServiceStatus.ARCHIVED,
    ]),
    theme_variant: z.enum([
      ThemeVariant.LIGHT,
      ThemeVariant.DARK,
      ThemeVariant.AUTO,
    ]),
    is_featured: z.boolean(),
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
    reset,
    formState: { errors, isValid },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onTouched",
    defaultValues: {
      id: form.id || uuidv4(),
      ...form,
      slug: form.slug || "",
      title: form.title || "",
      short_description: form.shortDescription || "",
      image_urls: form.imageUrls || [],
      cta_label: form.ctaLabel || "Liên hệ tư vấn",
      cta_link: form.ctaLink || "",
      status: form.status || ServiceStatus.PUBLISHED,
      theme_variant: form.themeVariant || ThemeVariant.AUTO,
      is_featured: form.isFeatured || false,
      order_index: form.orderIndex || 0,
      tags: form.tags || [],
      features: arrayToHtmlList(form.features),
      technologies: arrayToHtmlList(form.technologies),
      benefits: arrayToHtmlList(form.benefits),
      content: arrayToHtmlList(form.content),
    },
  });

  useEffect(() => {
    const loadForm = async () => {
      reset({
        ...form,
        id: form.id || uuidv4(),
        slug: form.slug || "",
        title: form.title || "",
        short_description: form.shortDescription || "",
        image_urls: form.imageUrls || [],
        cta_label: form.ctaLabel || "Liên hệ tư vấn",
        cta_link: form.ctaLink || "#",
        status: form.status || ServiceStatus.PUBLISHED,
        theme_variant: form.themeVariant || ThemeVariant.AUTO,
        is_featured: form.isFeatured || false,
        order_index: form.orderIndex || 0,
        tags: form.tags || [],
        features: arrayToHtmlList(form.features),
        technologies: arrayToHtmlList(form.technologies),
        benefits: arrayToHtmlList(form.benefits),
        content: arrayToHtmlList(form.content),
      });

      // Resolve keys to presigned URLs for display
      if (form.imageUrls && form.imageUrls.length > 0) {
        const resolvedUrls = await resolveImageUrls(form.imageUrls);
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
      (watch("image_urls")?.length || 0) + pendingFiles.length + files.length;
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
    const existingImages = watch("image_urls") || [];
    const existingImagesCount = existingImages.length;

    if (index < existingImagesCount) {
      // Xóa ảnh đã tồn tại trên server
      const imageToRemove = existingImages[index];
      if (imageToRemove) {
        setDeletedImageUrls((prev) => [...prev, imageToRemove]);
      }

      const newImageUrls = [...existingImages];
      newImageUrls.splice(index, 1);
      setValue("image_urls", newImageUrls, { shouldValidate: true });

      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    } else {
      // Xóa ảnh mới chưa upload
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
    // Manual validation for at least one image before submitting
    const totalImages = (data.image_urls?.length || 0) + pendingFiles.length;
    if (totalImages === 0) {
      notifications.show({
        color: "red",
        title: t("validation.error"),
        message: t("validation.imageUrlsRequired"),
      });
      setIsSubmitting(false);
      return; // Stop submission
    }

    try {
      // Bước 1: Xóa các ảnh đã bị remove trên server
      if (deletedImageUrls.length > 0) {
        toast.loading(t("serviceForm.deletingImages"), {
          id: "delete-service-images",
        });
        await Promise.all(
          deletedImageUrls.map((key) => {
            // Works with both full URLs and MinIO keys
            return uploadService.deleteImage(key);
          })
        );
        toast.dismiss("delete-service-images");
        toast.success(
          t("serviceForm.deleteSuccess", { count: deletedImageUrls.length })
        );
      }

      // Bước 2: Upload ảnh mới
      let finalImageKeys = (data.image_urls || []).map((k) => getKeyFromUrl(k));

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
        const newImageKeys = uploadedResults.map((res) => res.public_id); // Now returns keys
        finalImageKeys = [...finalImageKeys, ...newImageKeys];
        toast.dismiss("upload-service-images");
        toast.success(
          t("serviceForm.uploadSuccess", { count: newImageKeys.length })
        );
      }

      const processHtmlField = (html: string | undefined): string => {
        if (!html || html.trim() === "" || html === "<p></p>") {
          return "";
        }
        return html;
      };

      // Bước 3: Chuẩn bị dữ liệu và submit
      const finalData = {
        ...data,
        image_urls: finalImageKeys,
        features: processHtmlField(data.features),
        technologies: processHtmlField(data.technologies),
        benefits: processHtmlField(data.benefits),
      };

      setPendingFiles([]);
      await onSubmit(finalData);

      // Bước 4: Reset state sau khi submit thành công
      setDeletedImageUrls([]);
    } catch (e: any) {
      toast.error(e?.message || t("serviceForm.uploadError"), {
        id: "upload-service-images",
      });
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormState = async () => {
    // Reset deleted images
    setDeletedImageUrls([]);

    // Reset về trạng thái ban đầu
    setPendingFiles([]);

    // Resolve keys to presigned URLs for display
    if (form.imageUrls && form.imageUrls.length > 0) {
      const resolvedUrls = await resolveImageUrls(form.imageUrls);
      setPreviewUrls(resolvedUrls);
    } else {
      setPreviewUrls([]);
    }

    // Reset form values
    reset({
      ...form,
      slug: form.slug || "",
      title: form.title || "",
      short_description: form.shortDescription || "",
      image_urls: form.imageUrls || [],
      cta_label: form.ctaLabel || "Liên hệ tư vấn",
      cta_link: form.ctaLink || "#",
      status: form.status || ServiceStatus.PUBLISHED,
      theme_variant: form.themeVariant || ThemeVariant.AUTO,
      is_featured: form.isFeatured || false,
      order_index: form.orderIndex || 0,
      tags: form.tags || [],
      features: arrayToHtmlList(form.features),
      technologies: arrayToHtmlList(form.technologies),
      benefits: arrayToHtmlList(form.benefits),
      content: arrayToHtmlList(form.content),
    });
  };

  return {
    register,
    setValue,
    watch,
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
