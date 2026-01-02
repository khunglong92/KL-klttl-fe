import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";
import { useTranslation } from "react-i18next";

export interface CategoryItem {
  id: number;
  name: string;
}

export interface ImageItem {
  file?: File;
  url?: string;
  preview?: string;
}

export interface ProductFormData {
  id: string;
  name: string;
  categoryId: number | null;
  description: string[];
  detailedDescription: string;
  price: string | null;
  images: string[];
  isFeatured: boolean;
  showPrice: boolean;
}

export interface UseProductFormParams {
  isEditing: boolean;
  form: {
    id?: string;
    name: string;
    description?: string[] | string | null;
    detailedDescription?: string | null;
    price?: string | null;
    images?: string[] | string | null;
    categoryId: number | null;
    isFeatured?: boolean;
    showPrice?: boolean;
  };
  onSubmit: (finalForm: any) => Promise<void>;
}

export function useProductForm(
  params: UseProductFormParams,
  categories: CategoryItem[]
) {
  const { t } = useTranslation();
  const { isEditing, form, onSubmit } = params;
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);

  // Resolve image keys to displayable URLs
  const resolveImageUrls = useCallback(
    async (keys: string[]): Promise<ImageItem[]> => {
      try {
        const urls = await uploadService.getMultipleFileUrls(keys);
        return keys.map((key) => ({
          url: key, // Keep original key for backend operations
          preview: urls[key] || key, // Use resolved URL for display
        }));
      } catch (error) {
        console.warn("Failed to resolve image URLs:", error);
        return keys.map((key) => ({ url: key, preview: key }));
      }
    },
    []
  );

  const parseDescription = (desc: any): string[] => {
    if (!desc) return [""];
    if (Array.isArray(desc)) return desc.length > 0 ? desc : [""];
    if (typeof desc === "string") {
      try {
        const parsed = JSON.parse(desc);
        return Array.isArray(parsed)
          ? parsed.length > 0
            ? parsed
            : [""]
          : [desc];
      } catch {
        return [desc];
      }
    }
    return [""];
  };

  const parseImages = (imgs: any): string[] => {
    if (!imgs) return [];
    if (Array.isArray(imgs)) return imgs;
    if (typeof imgs === "string") {
      try {
        const parsed = JSON.parse(imgs);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return imgs.split(",").filter(Boolean);
      }
    }
    return [];
  };

  // IMPORTANT: When editing, always use the existing product ID
  // Only generate new UUID for new products
  const initialId = isEditing && form.id ? form.id : form.id || uuidv4();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      id: initialId,
      name: form.name || "",
      categoryId: form.categoryId,
      description: parseDescription(form.description),
      detailedDescription: "",
      price: form.price || null,
      images: [],
      isFeatured: form.isFeatured ?? true,
      showPrice: form.showPrice ?? true,
    },
  });

  // Load detailed description from MinIO if it's a key
  useEffect(() => {
    const loadDetailedDescription = async () => {
      if (isEditing && form.detailedDescription) {
        setIsLoadingDetailed(true);
        try {
          const url = await uploadService.getFileUrl(form.detailedDescription);
          const response = await fetch(url);
          if (response.ok) {
            const content = await response.text();
            setValue("detailedDescription", content);
          }
        } catch (error) {
          console.error("Failed to load detailed description:", error);
        } finally {
          setIsLoadingDetailed(false);
        }
      }
    };
    loadDetailedDescription();
  }, [isEditing, form.detailedDescription, setValue]);

  useEffect(() => {
    const loadForm = async () => {
      const nextParsedDesc = parseDescription(form.description);
      const nextParsedImages = parseImages(form.images);
      // IMPORTANT: When editing, always use the existing product ID (form.id)
      // Only generate new UUID for new products (when isEditing is false and no form.id)
      const nextId = isEditing && form.id ? form.id : form.id || uuidv4();

      reset({
        id: nextId,
        name: form.name || "",
        categoryId: form.categoryId,
        description: nextParsedDesc,
        detailedDescription: "",
        price: form.price || null,
        images: [],
        isFeatured: form.isFeatured ?? true,
        showPrice: form.showPrice ?? true,
      });

      if (isEditing && nextParsedImages.length > 0) {
        const resolvedImages = await resolveImageUrls(nextParsedImages);
        setImageFiles(resolvedImages);
      } else {
        setImageFiles([]);
      }
      setDeletedImageUrls([]);
    };

    loadForm();
  }, [isEditing, form, reset, resolveImageUrls]);

  const shortDescriptions = useFieldArray({
    control,
    name: "description" as never,
  });

  const handleImageSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    const MAX_FILES = 12;
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    const remainingSlots = Math.max(0, MAX_FILES - imageFiles.length);

    if (remainingSlots === 0) {
      notifications.show({
        color: "red",
        message: t("productsPage.admin.form.toasts.maxFiles", {
          count: MAX_FILES,
        }),
      });
      return;
    }

    const selected = files.slice(0, remainingSlots);
    selected.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_SIZE_BYTES) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const preview = ev.target?.result as string;
        setImageFiles((prev) => [...prev, { file, preview }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageFile = (index: number) => {
    const imageToRemove = imageFiles[index];
    if (imageToRemove && imageToRemove.url && !imageToRemove.file) {
      const key = getKeyFromUrl(imageToRemove.url as string);
      setDeletedImageUrls((prev) => [...prev, key]);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data: ProductFormData) => {
    // Validate product name
    if (!data.name || !data.name.trim()) {
      notifications.show({
        color: "red",
        message: t("productsPage.admin.form.validation.nameRequired", {
          defaultValue: "Vui lòng nhập tên sản phẩm",
        }),
      });
      return;
    }

    if (data.name.trim().length < 3) {
      notifications.show({
        color: "red",
        message: t("productsPage.admin.form.validation.nameTooShort", {
          defaultValue: "Tên sản phẩm phải có ít nhất 3 ký tự",
        }),
      });
      return;
    }

    // Validate at least one image
    if (imageFiles.length === 0) {
      notifications.show({
        color: "red",
        message: t("productsPage.admin.form.validation.atLeastOneImage"),
      });
      return;
    }

    // Validate categoryId is a valid integer >= 1
    const categoryIdNum =
      typeof data.categoryId === "string"
        ? parseInt(data.categoryId, 10)
        : data.categoryId;

    if (!categoryIdNum || isNaN(categoryIdNum) || categoryIdNum < 1) {
      notifications.show({
        color: "red",
        message: t("productsPage.admin.form.validation.categoryRequired", {
          defaultValue: "Vui lòng chọn danh mục sản phẩm",
        }),
      });
      return;
    }

    try {
      // CRITICAL: Use the actual product ID for file uploads
      // When editing, form.id contains the real product ID from the server
      // When creating, data.id contains a new UUID
      const productIdForUpload = isEditing && form.id ? form.id : data.id;

      // 1. Upload Images
      const filesToUpload = imageFiles.filter((i) => i.file);
      const uploadedKeys: string[] = [];

      if (filesToUpload.length > 0) {
        toast.loading(
          t("productsPage.admin.form.toasts.uploadingImages", {
            count: filesToUpload.length,
          }),
          {
            id: "upload-images",
          }
        );
        const results = await Promise.all(
          filesToUpload.map((i) =>
            uploadService.uploadImage(
              i.file as File,
              `products/${productIdForUpload}/images`,
              {
                productId: productIdForUpload,
                categoryId: categoryIdNum || undefined,
              }
            )
          )
        );
        uploadedKeys.push(...results.map((r) => r.public_id));
        toast.dismiss("upload-images");
      }

      const existingKeys = imageFiles
        .filter((i) => i.url && !i.file)
        .map((i) => getKeyFromUrl(i.url as string));
      const allImageKeys = [...existingKeys, ...uploadedKeys];

      // 2. Upload Detailed Description (HTML file)
      let detailedDescriptionKey = form.detailedDescription || null;
      if (data.detailedDescription) {
        toast.loading(t("productsPage.admin.form.toasts.savingDetailed"), {
          id: "upload-detailed",
        });
        const blob = new Blob([data.detailedDescription], {
          type: "text/html",
        });
        const htmlFile = new File([blob], "description.html", {
          type: "text/html",
        });

        const uploadResult = await uploadService.uploadToMinio(
          htmlFile,
          `products/${productIdForUpload}/content`,
          {
            productId: productIdForUpload,
            entityName: "product",
            categoryId: categoryIdNum || undefined,
            isDetailedDescription: true,
          }
        );
        detailedDescriptionKey = uploadResult.public_id;
        toast.dismiss("upload-detailed");
      }

      // 3. Final Payload
      const finalForm: any = {
        // Include id when creating so BE uses the same UUID as file uploads
        ...(!isEditing && { id: productIdForUpload }),
        name: data.name,
        description: data.description.filter((d) => d && d.trim()),
        detailedDescription: detailedDescriptionKey,
        price: data.price ? String(data.price) : null,
        images: allImageKeys,
        categoryId: categoryIdNum, // Use validated number
        isFeatured: data.isFeatured,
        showPrice: data.showPrice,
      };

      if (isEditing) {
        finalForm.deletedImages = deletedImageUrls;
      }

      await onSubmit(finalForm);
      setDeletedImageUrls([]);
    } catch (e: any) {
      toast.error(e?.message || t("productsPage.admin.form.toasts.error"));
    }
  };

  const onSubmitError = (errors: any) => {
    console.error("Form errors:", errors);
    notifications.show({
      color: "red",
      message: t("productsPage.admin.form.toasts.checkForm"),
    });
  };

  const formatPrice = (value: number | null) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const resetForm = async () => {
    setDeletedImageUrls([]);
    if (isEditing && parseImages(form.images).length > 0) {
      const resolvedImages = await resolveImageUrls(parseImages(form.images));
      setImageFiles(resolvedImages);
    } else {
      setImageFiles([]);
    }
  };

  return {
    imageFiles,
    setImageFiles,
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    errors,
    shortDescriptions,
    handleImageSelect,
    removeImageFile,
    onSubmitForm,
    onSubmitError,
    formatPrice,
    resetForm,
    watchedPrice: watch("price"),
    watchedCategoryId: watch("categoryId"),
    categories,
    deletedImageUrls,
    isLoadingDetailed,
  };
}
