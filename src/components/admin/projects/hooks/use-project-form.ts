import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { uploadService, getKeyFromUrl } from "@/services/api/uploadService";
import type { ImageItem } from "../components/project-image-upload";
import { Project, FormData } from "../types";

export interface UseProjectFormParams {
  project?: Project;
  onSubmit: (data: FormData) => Promise<void>;
}

export function useProjectForm({ project, onSubmit }: UseProjectFormParams) {
  const { t } = useTranslation();
  const [imageFiles, setImageFiles] = useState<ImageItem[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);

  // Initialize ID: use existing project ID or generate new UUID for uploads
  // Initialize ID: use existing project ID or generate new UUID for uploads (stabilized)
  const [projectId] = useState(() => project?.id || uuidv4());

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: project?.title || "",
      shortDescription: project?.shortDescription || "",
      detailedDescription: "", // Will be loaded async
      images: [],
      isFeatured: project?.isFeatured ?? false,
      isActive: project?.isActive ?? true,
    },
  });

  // Resolve image key to displayable URL
  const resolveImageUrl = useCallback(
    async (imageKey: string): Promise<string> => {
      try {
        return await uploadService.getFileUrl(imageKey);
      } catch (error) {
        console.warn("Failed to resolve image URL:", error);
        return imageKey;
      }
    },
    []
  );

  // Load detailed description content if it exists
  useEffect(() => {
    const loadDetailedContent = async () => {
      if (project?.detailedDescription) {
        // If it looks like a URL/Key (not just plain text), fetch it
        // Note: Legacy data might be plain text. We try to detect or just fetch.
        // Simple heuristic: If it doesn't contain spaces and has extension or is long random string?
        // Actually, existing products logic fetches it. For projects, it might be text currently.
        // IF we are migrating, we should assume it MIGHT be text.
        // But the requirement is to make it "like product".
        // Let's try to fetch it. If it fails (404/invalid url), assume it's text.

        // However, standard uploadService.getFileUrl might throw or return a URL.
        // If it was stored as text directly in DB, treating it as a key might get a 404 URL.

        // Strategy: Try to fetch. If fetch fails or result looks like error, fallback to using the string as is.
        // BUT, if it IS just text, duplicate 'fetch' might be wrong.

        // For now, let's implement the "load from file" logic. existing text data will likely fail to fetch and we can handle that?
        // Or we just set it as value initially.

        setIsLoadingDetailed(true);
        try {
          // Check if it looks like a MinIO key (e.g. has "projects/" prefix) or is just text
          // If it's a legacy text description, it won't be a valid key usually.
          // We can try to fetch it as a file.
          const url = await uploadService.getFileUrl(
            project.detailedDescription
          );
          const response = await fetch(url);
          if (response.ok) {
            const content = await response.text();
            setValue("detailedDescription", content);
          } else {
            // Fallback: Use existing string as content (Legacy support)
            setValue("detailedDescription", project.detailedDescription);
          }
        } catch {
          // If resolving URL fails, assume it's legacy text
          setValue("detailedDescription", project.detailedDescription);
        } finally {
          setIsLoadingDetailed(false);
        }
      }
    };
    loadDetailedContent();
  }, [project?.detailedDescription, setValue]);

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      if (project?.images && project.images.length > 0) {
        const imageItems = await Promise.all(
          project.images.map(async (imageKey) => {
            const key = getKeyFromUrl(imageKey);
            const displayUrl = await resolveImageUrl(key);
            return {
              url: key,
              preview: displayUrl,
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
  }, [project?.images, resolveImageUrl]);

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
    if (imageToRemove && imageToRemove.url && !imageToRemove.file) {
      setDeletedImageUrls((prev) => [...prev, imageToRemove.url as string]);
    }
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitForm = async (data: FormData) => {
    if (!data.title.trim()) {
      toast.error(t("projectsAdmin.form.validation.titleRequired"));
      return;
    }

    // Images validation
    // if (imageFiles.length === 0) ... (optional, depends on requirement, previously it was required)
    if (imageFiles.length === 0) {
      toast.error(t("projectsAdmin.form.imageUpload.atLeastOneImage"));
      return;
    }

    try {
      // 1. Prepare images
      const existingImageKeys = imageFiles
        .filter((i) => i.url && !i.file)
        .map((i) => getKeyFromUrl(i.url as string));

      const filesToUpload = imageFiles.filter((i) => i.file);
      let newImageKeys: string[] = [];

      if (filesToUpload.length > 0) {
        toast.loading(
          t("projectsAdmin.form.buttons.uploadingImages", {
            count: filesToUpload.length,
          }),
          { id: "upload-images" }
        );
        const uploadPath = `projects/${projectId}/images`;
        const results = await Promise.all(
          filesToUpload.map((i) =>
            uploadService.uploadImage(i.file as File, uploadPath)
          )
        );
        newImageKeys = results
          .filter((r) => r && r.public_id)
          .map((r) => r.public_id);
        toast.dismiss("upload-images");
      }

      const allImages = [...existingImageKeys, ...newImageKeys];

      // 2. UPLOAD DETAILED DESCRIPTION (HTML)
      let detailedDescriptionKey = project?.detailedDescription || "";

      // If content changed or is new, upload it
      if (data.detailedDescription) {
        toast.loading(t("projectsAdmin.form.buttons.saving"), {
          id: "save-html",
        });

        const blob = new Blob([data.detailedDescription], {
          type: "text/html",
        });
        const htmlFile = new File([blob], "description.html", {
          type: "text/html",
        });

        const uploadResult = await uploadService.uploadToMinio(
          htmlFile,
          `projects/${projectId}/content`,
          {
            entityName: "project",
            isDetailedDescription: true,
          }
        );
        detailedDescriptionKey = uploadResult.public_id;
        toast.dismiss("save-html");
      }

      const finalData: FormData = {
        ...((!project || !project.id) && { id: projectId }),
        ...data,
        images: allImages,
        detailedDescription: detailedDescriptionKey,
        deletedImages: deletedImageUrls, // Send list of deleted images to backend
      };

      await onSubmit(finalData);
      setDeletedImageUrls([]); // Clear after successful submit
    } catch (error) {
      console.error("Error submitting project form:", error);
      toast.error(t("projectsAdmin.toast.saveProjectError"));
    }
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    imageFiles,
    handleImageSelect,
    removeImageFile,
    onSubmitForm,
    isLoadingDetailed,
  };
}
