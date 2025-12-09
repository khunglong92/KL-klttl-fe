import { useState, useEffect, FC, ChangeEvent, FormEvent } from "react";
import {
  TextInput,
  Textarea,
  Checkbox,
  Select,
  Stack,
  Group,
  Text,
  Grid,
} from "@mantine/core";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { FormData, Project } from "../types";
import { ProjectImageUpload } from "./project-image-upload";
import { useProjectForm } from "../hooks/use-project-form";

interface ProjectCategory {
  id: string;
  name: string;
}

const ProjectForm: FC<{
  categories: ProjectCategory[];
  project?: Project | undefined;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}> = ({ categories, project, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const initialFormData: FormData = {
    categoryId: "",
    name: "",
    slug: "",
    description: "",
    content: "",
    location: "",
    completionDate: "",
    image: "",
    gallery: null,
    isFeatured: false,
    isActive: true,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const {
    imageFiles,
    handleImageSelect,
    removeImageFile,
    uploadProjectImages,
  } = useProjectForm({ project });

  useEffect(() => {
    if (project) {
      setFormData({
        categoryId: project.categoryId,
        name: project.name,
        slug: project.slug,
        description: project.description || "",
        content: project.content || "",
        location: project.location || "",
        completionDate: project?.completionDate
          ? project.completionDate.split("T")[0]
          : "",
        image: project.image || "",
        gallery: project.gallery || null,
        isFeatured: project.isFeatured,
        isActive: project.isActive,
      });
    }
  }, [project]);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error(t("projectsAdmin.form.validation.categoryRequired"));
      return;
    }

    if (!formData.name.trim()) {
      toast.error(t("projectsAdmin.form.validation.nameRequired"));
      return;
    }

    if (!formData.slug.trim()) {
      toast.error(t("projectsAdmin.form.validation.slugRequired"));
      return;
    }

    if (imageFiles.length === 0) {
      toast.error(t("projectsAdmin.form.imageUpload.atLeastOneImage"));
      return;
    }

    try {
      setLoading(true);

      // Upload images and get all image URLs
      const projectId = project?.id || formData.slug;
      const { mainImage, allImages } = await uploadProjectImages(
        formData.categoryId,
        projectId
      );

      const submitData: FormData = {
        ...formData,
        image: mainImage || "",
        gallery: allImages.length > 0 ? allImages : null,
        completionDate: formData.completionDate
          ? new Date(formData.completionDate).toISOString()
          : "",
      };
      await onSubmit(submitData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Select
          label={t("projectsAdmin.form.labels.category")}
          placeholder={t("projectsAdmin.form.placeholders.category")}
          value={formData.categoryId}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, categoryId: value || "" }))
          }
          data={categories.map((cat) => ({
            value: cat.id,
            label: cat.name,
          }))}
          required
          searchable
        />

        <TextInput
          label={t("projectsAdmin.form.labels.name")}
          placeholder={t("projectsAdmin.form.placeholders.name")}
          value={formData.name}
          onChange={handleNameChange}
          required
        />

        <Stack gap="xs">
          <TextInput
            label={t("projectsAdmin.form.labels.slug")}
            placeholder={t("projectsAdmin.form.placeholders.slug")}
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
          />
          <Text size="xs" c="dimmed">
            {t("projectsAdmin.form.placeholders.slugHelp")}
          </Text>
        </Stack>

        <Textarea
          label={t("projectsAdmin.form.labels.shortDescription")}
          placeholder={t("projectsAdmin.form.placeholders.shortDescription")}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          minRows={2}
        />

        <Textarea
          label={t("projectsAdmin.form.labels.content")}
          placeholder={t("projectsAdmin.form.placeholders.content")}
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          minRows={4}
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label={t("projectsAdmin.form.labels.location")}
              placeholder={t("projectsAdmin.form.placeholders.location")}
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label={t("projectsAdmin.form.labels.completionDate")}
              placeholder={t("projectsAdmin.form.placeholders.completionDate")}
              type="date"
              value={formData.completionDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  completionDate: e.target.value,
                }))
              }
            />
          </Grid.Col>
        </Grid>

        <ProjectImageUpload
          imageFiles={imageFiles}
          handleImageSelect={handleImageSelect}
          removeImageFile={removeImageFile}
        />

        <Stack gap="sm">
          <Checkbox
            label={t("projectsAdmin.form.labels.featured")}
            checked={formData.isFeatured}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isFeatured: e.currentTarget.checked,
              }))
            }
          />
          <Checkbox
            label={t("projectsAdmin.form.labels.active")}
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.currentTarget.checked,
              }))
            }
          />
        </Stack>

        <Group justify="flex-end" gap="md" mt="lg">
          <AppButton
            variant="default"
            onClick={onCancel}
            label={t("projectsAdmin.form.buttons.cancel")}
            showArrow={false}
          />

          <AppButton
            variant="default"
            loading={loading}
            label={
              loading
                ? t("projectsAdmin.form.buttons.saving")
                : t("projectsAdmin.form.buttons.save")
            }
            showArrow={false}
            htmlType="submit"
          />
        </Group>
      </Stack>
    </form>
  );
};

export default ProjectForm;
