import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";

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
  description: {
    overview: string;
    features: string[];
    applications: string[];
    materials: string[];
  };
  technicalSpecs: {
    dimensions: string;
    weight: string;
    material: string;
    surfaceFinish: string;
    loadCapacity: string;
    weldingType: string;
    customizable: boolean;
  };
  price: string | null;
  warrantyPolicy: string;
  images: string[];
  isFeatured: boolean;
}

export interface UseProductFormParams {
  isEditing: boolean;
  form: {
    id?: string;
    name: string;
    description: string;
    technicalSpecs: string;
    price: string;
    warrantyPolicy: string;
    images: string;
    categoryId: number | null;
    isFeatured?: boolean;
  };
  setForm: (next: any) => void;
  onSubmit: (finalForm: {
    id?: string;
    name: string;
    description: string;
    technicalSpecs: string;
    price: string;
    warrantyPolicy: string;
    images: string;
    categoryId: number | null;
    isFeatured?: boolean;
  }) => Promise<void>;
}

export function useProductForm(
  params: UseProductFormParams,
  categories: CategoryItem[]
) {
  const { isEditing, form, setForm, onSubmit } = params;
  const [currentTab, setCurrentTab] = useState("basic");
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

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

  const parseDescription = (
    desc: string | Record<string, unknown> | null | undefined
  ) => {
    if (!desc)
      return {
        overview: "",
        features: [""],
        applications: [""],
        materials: [""],
      };
    if (typeof desc === "string") {
      try {
        const parsed = JSON.parse(desc);
        return {
          overview: parsed.overview || "",
          features: Array.isArray(parsed.features) ? parsed.features : [""],
          applications: Array.isArray(parsed.applications)
            ? parsed.applications
            : [""],
          materials: Array.isArray(parsed.materials) ? parsed.materials : [""],
        };
      } catch {
        return {
          overview: desc,
          features: [""],
          applications: [""],
          materials: [""],
        };
      }
    }
    return {
      overview: (desc["overview"] as string) || "",
      features: Array.isArray(desc["features"]) ? desc["features"] : [""],
      applications: Array.isArray(desc["applications"])
        ? desc["applications"]
        : [""],
      materials: Array.isArray(desc["materials"]) ? desc["materials"] : [""],
    };
  };

  const parseTechnicalSpecs = (
    specs: string | Record<string, unknown> | null | undefined
  ) => {
    if (!specs)
      return {
        dimensions: "",
        weight: "",
        material: "",
        surfaceFinish: "",
        loadCapacity: "",
        weldingType: "",
        customizable: false,
      };
    if (typeof specs === "string") {
      try {
        const parsed = JSON.parse(specs);
        return {
          dimensions: parsed.dimensions || "",
          weight: parsed.weight || "",
          material: parsed.material || "",
          surfaceFinish: parsed.surfaceFinish || "",
          loadCapacity: parsed.loadCapacity || "",
          weldingType: parsed.weldingType || "",
          customizable: parsed.customizable || false,
        };
      } catch {
        return {
          dimensions: "",
          weight: "",
          material: "",
          surfaceFinish: "",
          loadCapacity: "",
          weldingType: "",
          customizable: false,
        };
      }
    }
    return {
      dimensions: (specs["dimensions"] as string) || "",
      weight: (specs["weight"] as string) || "",
      material: (specs["material"] as string) || "",
      surfaceFinish: (specs["surfaceFinish"] as string) || "",
      loadCapacity: (specs["loadCapacity"] as string) || "",
      weldingType: (specs["weldingType"] as string) || "",
      customizable: (specs["customizable"] as boolean) || false,
    };
  };

  const parseImages = (imgs: string | string[] | null | undefined) => {
    if (!imgs) return [] as string[];
    if (typeof imgs === "string") {
      try {
        const parsed = JSON.parse(imgs);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return imgs.split(",").filter(Boolean);
      }
    }
    return Array.isArray(imgs) ? imgs : [];
  };
  const parsedDescription = parseDescription(form.description);
  const parsedTechnicalSpecs = parseTechnicalSpecs(form.technicalSpecs);
  const parsedImages = parseImages(form.images);

  const extractFolderIdFromUrls = (urls: string[]): string | undefined => {
    for (const url of urls) {
      try {
        const path = new URL(url, window.location.origin).pathname;
        // Match /products/{categoryId}/{folderId}/...
        const match = path.match(/\/products\/(?:[^/]+)\/([^/]+)\//);
        if (match && match[1]) return match[1];
      } catch {
        // Fallback for relative URLs or MinIO keys
        const match = url.match(/products\/(?:[^/]+)\/([^/]+)\//);
        if (match && match[1]) return match[1];
      }
    }
    return undefined;
  };

  const initialFolderId =
    form.id || extractFolderIdFromUrls(parsedImages) || uuidv4();

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
      id: initialFolderId,
      name: form.name || "",
      categoryId: form.categoryId,
      description: parsedDescription,
      technicalSpecs: parsedTechnicalSpecs,
      price: form.price || null,
      warrantyPolicy: form.warrantyPolicy || "",
      images: [],
      isFeatured: form.isFeatured ?? true,
    },
  });

  useEffect(() => {
    const loadForm = async () => {
      // Recompute values when switching between edit/create or when form changes
      const nextParsedDesc = parseDescription(form.description);
      const nextParsedSpecs = parseTechnicalSpecs(form.technicalSpecs);
      const nextParsedImages = parseImages(form.images);
      const nextId =
        form.id || extractFolderIdFromUrls(nextParsedImages) || uuidv4();

      reset({
        id: nextId,
        name: form.name || "",
        categoryId: form.categoryId,
        description: nextParsedDesc,
        technicalSpecs: nextParsedSpecs,
        price: form.price || null,
        warrantyPolicy: form.warrantyPolicy || "",
        images: [],
        isFeatured: form.isFeatured ?? true,
      });

      if (isEditing && nextParsedImages.length > 0) {
        // Resolve keys to presigned URLs for display
        const resolvedImages = await resolveImageUrls(nextParsedImages);
        setImageFiles(resolvedImages);
      } else {
        setImageFiles([]);
      }
      setDeletedImageUrls([]);
    };

    loadForm();
  }, [isEditing, form, reset, resolveImageUrls]);

  useEffect(() => {
    register("categoryId", { required: true });
  }, [register]);

  const featuresArray = useFieldArray({
    control,
    // @ts-ignore - react-hook-form type inference issue
    name: "description.features",
  });
  const applicationsArray = useFieldArray({
    control,
    // @ts-ignore - react-hook-form type inference issue
    name: "description.applications",
  });
  const materialsArray = useFieldArray({
    control,
    // @ts-ignore - react-hook-form type inference issue
    name: "description.materials",
  });

  const handleImageSelect = (files: File[]) => {
    if (!files || files.length === 0) return;
    const MAX_FILES = 10;
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    const remainingSlots = Math.max(0, MAX_FILES - imageFiles.length);
    if (remainingSlots === 0) {
      notifications.show({
        color: "red",
        message: `Tối đa ${MAX_FILES} hình ảnh cho mỗi sản phẩm`,
      });
      return;
    }
    const selected = files.slice(0, remainingSlots);
    if (files.length > selected.length) {
      notifications.show({
        color: "red",
        message: `Chỉ có thể chọn thêm ${remainingSlots} hình ảnh (tối đa ${MAX_FILES})`,
      });
    }
    selected.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        notifications.show({
          color: "red",
          message: `File ${file.name} không phải hình ảnh`,
        });
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        notifications.show({
          color: "red",
          message: `"${file.name}" vượt quá 10MB`,
        });
        return;
      }
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

    // Nếu là ảnh đã tồn tại trên server (có url nhưng không có file mới)
    if (imageToRemove && imageToRemove.url && !imageToRemove.file) {
      setDeletedImageUrls((prev) => [...prev, imageToRemove.url as string]);
    }

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data: ProductFormData) => {
    // Validation is now handled by react-hook-form's `handleSubmit`.
    // The `onSubmitError` function will be called if there are errors.

    if (imageFiles.length === 0) {
      notifications.show({
        color: "red",
        message: "Vui lòng thêm ít nhất 1 hình ảnh cho sản phẩm",
      });
      setCurrentTab("images");
      return;
    }

    try {
      // Bước 1: Xóa các ảnh đã bị remove trên server
      if (deletedImageUrls.length > 0) {
        toast.loading("Đang xóa ảnh cũ...", { id: "delete-images" });
        await Promise.all(
          deletedImageUrls.map((key) => {
            // Works with both full URLs and MinIO keys
            return uploadService.deleteImage(key);
          })
        );
        toast.dismiss("delete-images");
        toast.success(`Đã xóa ${deletedImageUrls.length} ảnh cũ`);
      }

      // Bước 2: Upload ảnh mới
      const filesToUpload = imageFiles.filter((i) => i.file);

      const uploadedKeys: string[] = [];
      if (filesToUpload.length > 0) {
        toast.loading(`Đang tải lên ${filesToUpload.length} ảnh...`, {
          id: "upload-images",
        });
        const results = await Promise.all(
          filesToUpload.map((i) =>
            uploadService.uploadImage(
              i.file as File,
              `products/${data.categoryId}/${data.id}`
            )
          )
        );
        uploadedKeys.push(...results.map((r) => r.public_id)); // Now returns keys
        toast.dismiss("upload-images");
        toast.success(`Đã tải lên ${uploadedKeys.length} ảnh mới`);
      }

      // Bước 3: Kết hợp ảnh cũ (chưa bị xóa) và ảnh mới
      const existingKeys = imageFiles
        .filter((i) => i.url && !i.file)
        .map((i) => getKeyFromUrl(i.url as string));
      const allImageKeys = [...existingKeys, ...uploadedKeys];

      const descriptionObj = {
        overview: data.description.overview,
        features: data.description.features.filter((f) => f.trim()),
        applications: data.description.applications.filter((a) => a.trim()),
        materials: data.description.materials.filter((m) => m.trim()),
      };
      const technicalSpecsObj: Record<string, unknown> = {
        dimensions: data.technicalSpecs.dimensions,
        weight: data.technicalSpecs.weight,
        material: data.technicalSpecs.material,
        surfaceFinish: data.technicalSpecs.surfaceFinish,
        loadCapacity: data.technicalSpecs.loadCapacity,
        weldingType: data.technicalSpecs.weldingType,
        customizable: data.technicalSpecs.customizable,
      };
      Object.keys(technicalSpecsObj).forEach((k) => {
        const v = technicalSpecsObj[k];
        if (v === "" || v === null || v === undefined)
          delete technicalSpecsObj[k];
      });

      const finalForm = {
        id: data.id, // Add this line
        name: data.name,
        description: JSON.stringify(descriptionObj),
        technicalSpecs: JSON.stringify(technicalSpecsObj),
        price: data.price ? String(data.price) : "",
        warrantyPolicy: data.warrantyPolicy || "",
        images: JSON.stringify(allImageKeys),
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
      };

      // Bước 4: Cập nhật product
      setForm(finalForm);
      await onSubmit(finalForm);

      // Bước 5: Reset state sau khi submit thành công
      setDeletedImageUrls([]);
    } catch (e: any) {
      toast.error(e?.message || "Có lỗi xảy ra");
      // Không throw để tránh trigger onSubmitError
    }
  };

  const onSubmitError = (errors: any) => {
    if (errors?.name) {
      notifications.show({
        color: "red",
        message: String(errors.name.message || "Tên sản phẩm là bắt buộc"),
      });
      return;
    }
    if (errors?.categoryId) {
      notifications.show({ color: "red", message: "Vui lòng chọn danh mục" });
      return;
    }
    if (errors?.price) {
      notifications.show({
        color: "red",
        message: String(errors.price.message || "Vui lòng nhập giá sản phẩm"),
      });
      return;
    }
    if (errors?.description?.overview) {
      notifications.show({
        color: "red",
        message: String(
          errors.description.overview.message || "Vui lòng nhập mô tả tổng quan"
        ),
      });
      return;
    }
  };

  const formatPrice = (value: number | null) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const resetForm = async () => {
    // Reset deleted images
    setDeletedImageUrls([]);

    // Reset image files về trạng thái ban đầu
    if (isEditing && parsedImages.length > 0) {
      const resolvedImages = await resolveImageUrls(parsedImages);
      setImageFiles(resolvedImages);
    } else {
      setImageFiles([]);
    }

    // Reset tab về basic
    setCurrentTab("basic");
  };

  return {
    currentTab,
    setCurrentTab,
    imageFiles,
    setImageFiles,
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    errors,
    featuresArray,
    applicationsArray,
    materialsArray,
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
  };
}
