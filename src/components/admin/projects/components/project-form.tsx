import { FC } from "react";
import { TextInput, Textarea, Checkbox, Stack, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { FormData, Project } from "../types";
import { ProjectImageUpload } from "./project-image-upload";
import { useProjectForm } from "../hooks/use-project-form";
import { DetailedDescriptionSection } from "./sections/DetailedDescriptionSection";

const ProjectForm: FC<{
  project?: Project | undefined;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}> = ({ project, onSubmit, onCancel }) => {
  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    errors,
    imageFiles,
    handleImageSelect,
    removeImageFile,
    onSubmitForm,
    isLoadingDetailed,
  } = useProjectForm({ project, onSubmit });

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Stack gap="md">
        <TextInput
          label={t("projectsAdmin.form.labels.title", "Tên dự án")}
          placeholder={t(
            "projectsAdmin.form.placeholders.title",
            "Nhập tên dự án..."
          )}
          {...register("title", {
            required: t(
              "projectsAdmin.form.validation.titleRequired",
              "Vui lòng nhập tên dự án"
            ),
          })}
          error={errors.title?.message}
          required
        />

        <Textarea
          label={t("projectsAdmin.form.labels.shortDescription")}
          placeholder={t("projectsAdmin.form.placeholders.shortDescription")}
          {...register("shortDescription")}
          minRows={2}
        />

        <DetailedDescriptionSection control={control} />

        <ProjectImageUpload
          imageFiles={imageFiles}
          handleImageSelect={handleImageSelect}
          removeImageFile={removeImageFile}
        />

        <Stack gap="sm">
          <Checkbox
            label={t("projectsAdmin.form.labels.featured")}
            {...register("isFeatured")}
          />
          <Checkbox
            label={t("projectsAdmin.form.labels.active")}
            {...register("isActive")}
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
            loading={isLoadingDetailed} // Show loading if uploading or fetching
            label={t("projectsAdmin.form.buttons.save")}
            showArrow={false}
            htmlType="submit"
          />
        </Group>
      </Stack>
    </form>
  );
};

export default ProjectForm;
