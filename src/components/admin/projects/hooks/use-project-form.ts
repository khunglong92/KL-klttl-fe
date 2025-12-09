import { useState, useEffect, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";
import type { ImageItem } from "../components/project-image-upload";

export interface UseProjectFormParams {
  project?: {
    id: string;
    categoryId: string;
    name: string;
    slug: string;
    description?: string;
    content?: string;
    location?: string;
    completionDate?: string;
    image?: string;
    gallery?: any;
    isFeatured: boolean;
    isActive: boolean;
  };
}

export function useProjectForm(params: UseProjectFormParams) {
  const { t } = useTranslation();
  const { project } = params;
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  // Resolve image key to displayable URL
  const resolveImageUrl = useCallback(
    async (imageKey: string): Promise<string> => {
      try {
        return await uploadService.getFileUrl(imageKey);
      } catch (error) {
        console.warn("Failed to resolve image URL:", error);
        return imageKey; // Fallback to original value
      }
    },
    []
  );

  // Initialize images from existing project
  useEffect(() => {
    const loadImages = async () => {
      // Get all images from gallery (which includes all uploaded images)
      let galleryImages: string[] = [];

      if (project?.gallery && Array.isArray(project.gallery)) {
        galleryImages = project.gallery as string[];
      } else if (project?.image) {
        // Fallback to single image if no gallery
        galleryImages = [project.image];
      }

      if (galleryImages.length > 0) {
        // Resolve all keys to presigned URLs for display
        const imageItems = await Promise.all(
          galleryImages.map(async (imageKey) => {
            const key = getKeyFromUrl(imageKey);
            const displayUrl = await resolveImageUrl(key);
            return {
              url: key, // Keep original key for backend operations
              preview: displayUrl, // Use resolved URL for display
            };
          })
        );
        setImageFiles(imageItems);
      } else {
        setImageFiles([]);
      }
      setDeletedImageUrls([]);
    };

    loadImages();
  }, [project?.id, project?.gallery, project?.image, resolveImageUrl]);

  const handleImageSelect = (files: File[]) => {
    if (!files || files.length === 0) return;

    const MAX_FILES = 10;
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    const remainingSlots = Math.max(0, MAX_FILES - imageFiles.length);

    if (remainingSlots === 0) {
      notifications.show({
        color: "red",
        message: t("projectsAdmin.form.imageUpload.maxFilesError", {
          max: MAX_FILES,
        }),
      });
      return;
    }

    const selected = files.slice(0, remainingSlots);

    if (files.length > selected.length) {
      notifications.show({
        color: "red",
        message: t("projectsAdmin.form.imageUpload.maxFilesWarning", {
          remaining: remainingSlots,
          max: MAX_FILES,
        }),
      });
    }

    selected.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        notifications.show({
          color: "red",
          message: t("projectsAdmin.form.imageUpload.invalidFileError", {
            name: file.name,
          }),
        });
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        notifications.show({
          color: "red",
          message: t("projectsAdmin.form.imageUpload.fileSizeError", {
            name: file.name,
          }),
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

    // If it's an existing image on server (has url but no new file)
    if (imageToRemove && imageToRemove.url && !imageToRemove.file) {
      setDeletedImageUrls((prev) => [...prev, imageToRemove.url as string]);
    }

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadProjectImages = async (
    categoryId: string,
    projectId: string
  ): Promise<{ mainImage: string | null; allImages: string[] }> => {
    try {
      // Step 1: Delete old images if any
      if (deletedImageUrls.length > 0) {
        toast.loading(t("projectsAdmin.form.buttons.deletingImages"), {
          id: "delete-images",
        });
        await Promise.all(
          deletedImageUrls.map((url) => {
            // Works with both full URLs and MinIO keys
            return uploadService.deleteImage(url);
          })
        );
        toast.dismiss("delete-images");
        toast.success(`Đã xóa ${deletedImageUrls.length} ảnh cũ`);
      }

      // Step 2: Collect existing images that weren't deleted
      const existingImageKeys: string[] = imageFiles
        .filter((i) => i.url && !i.file)
        .map((i) => getKeyFromUrl(i.url as string));

      // Step 3: Upload new images
      const filesToUpload = imageFiles.filter((i) => i.file);
      let newImageKeys: string[] = [];

      if (filesToUpload.length > 0) {
        toast.loading(
          t("projectsAdmin.form.buttons.uploadingImages", {
            count: filesToUpload.length,
          }),
          { id: "upload-images" }
        );

        const results = await Promise.all(
          filesToUpload.map((i) =>
            uploadService.uploadImage(
              i.file as File,
              `projects/${categoryId}/${projectId}`
            )
          )
        );

        // Collect all uploaded image keys
        newImageKeys = results
          .filter((r) => r && r.public_id)
          .map((r) => r.public_id);

        toast.dismiss("upload-images");
        toast.success(`Đã tải lên ${results.length} ảnh mới`);
      }

      // Combine existing and new images
      const allImageKeys = [...existingImageKeys, ...newImageKeys];
      const mainImageKey: string | null = allImageKeys[0] ?? null;

      return { mainImage: mainImageKey, allImages: allImageKeys };
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(t("projectsAdmin.toast.saveProjectError"));
      throw error;
    }
  };

  return {
    imageFiles,
    deletedImageUrls,
    handleImageSelect,
    removeImageFile,
    uploadProjectImages,
  };
}
