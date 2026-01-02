import { useTranslation } from "react-i18next";
import { useRecruitmentForm } from "../hooks/use-recruitment-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  Title,
  Group,
  Image,
  ActionIcon,
  Text,
  FileButton,
} from "@mantine/core";
import { IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { Recruitment, RecruitmentFormData } from "../types";
import { useTheme } from "@/hooks/useTheme";
import AppButton from "@/components/atoms/app-button";
import { Controller } from "react-hook-form";
import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";

interface RecruitmentFormProps {
  recruitment?: Partial<Recruitment>;
  onSubmit: (data: RecruitmentFormData) => Promise<void>;
  onCancel: () => void;
}

export default function RecruitmentForm({
  recruitment,
  onSubmit,
  onCancel,
}: RecruitmentFormProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    fields,
    append,
    control,
    mainImageFile,
    handleMainImageChange,
    handleRemoveMainImage,
    handleRemoveSection,
  } = useRecruitmentForm({ recruitment, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {t("recruitmentAdmin.form.labels.title", "Tiêu đề")} *
          </Label>
          <Input
            id="title"
            {...register("title", { required: true })}
            placeholder={t(
              "recruitmentAdmin.form.placeholders.title",
              "Nhập tiêu đề"
            )}
          />
          {errors.title && (
            <span className="text-sm text-red-500">
              {t(
                "recruitmentAdmin.form.errors.required",
                "Trường này là bắt buộc"
              )}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">
            {t("recruitmentAdmin.form.labels.subtitle", "Tiêu đề phụ")}
          </Label>
          <Input
            id="subtitle"
            {...register("subtitle")}
            placeholder={t(
              "recruitmentAdmin.form.placeholders.subtitle",
              "Nhập tiêu đề phụ"
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("recruitmentAdmin.form.labels.image", "Ảnh bìa")}</Label>
        <Card p="md" withBorder>
          <div className="flex flex-col gap-4">
            {!mainImageFile ? (
              <FileButton
                onChange={handleMainImageChange}
                accept="image/png,image/jpeg,image/webp"
              >
                {(props) => (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    {...props}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconUpload size={24} />
                      <span>
                        {t(
                          "recruitmentAdmin.form.uploadPlaceholder",
                          "Click để tải ảnh lên"
                        )}
                      </span>
                    </div>
                  </Button>
                )}
              </FileButton>
            ) : (
              <div className="relative group">
                <Image
                  src={mainImageFile.url}
                  alt="Main preview"
                  h={200}
                  w="100%"
                  fit="contain"
                  className="rounded-md bg-gray-100 dark:bg-gray-800"
                />
                <ActionIcon
                  variant="filled"
                  color="red"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemoveMainImage}
                >
                  <IconX size={16} />
                </ActionIcon>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="isFeatured"
            render={({ field }) => (
              <Checkbox
                id="isFeatured"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
            {t("recruitmentAdmin.form.labels.featured", "Tin nổi bật")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isActive" className="font-normal cursor-pointer">
            {t("recruitmentAdmin.form.labels.active", "Kích hoạt")}
          </Label>
        </div>
      </div>

      {/* Content Sections */}
      <Card
        withBorder
        radius="md"
        p="md"
        bg={theme === "dark" ? "dark.6" : "gray.0"}
      >
        <Group justify="space-between" mb="md">
          <Title order={5}>
            {t("recruitmentAdmin.form.sections.title", "Nội dung chi tiết")}
          </Title>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ title: "", description: "" } as any)}
          >
            <IconPlus className="h-4 w-4 mr-1" />
            {t("recruitmentAdmin.form.sections.add", "Thêm section")}
          </Button>
        </Group>

        {fields.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {t(
              "recruitmentAdmin.form.sections.empty",
              "Chưa có section nào. Nhấn nút trên để thêm."
            )}
          </Text>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} withBorder radius="md" p="md">
                <Group justify="space-between" mb="sm">
                  <Text fw={600}>
                    {t("recruitmentAdmin.form.sections.section")} {index + 1}
                  </Text>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => handleRemoveSection(index)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
                <div className="space-y-4">
                  <div>
                    <Label>
                      {t(
                        "recruitmentAdmin.form.sections.sectionTitle",
                        "Tiêu đề section"
                      )}
                    </Label>
                    <Input
                      {...register(`contentSections.${index}.title` as const)}
                      placeholder={t(
                        "recruitmentAdmin.form.sections.sectionTitlePlaceholder",
                        "Nhập tiêu đề"
                      )}
                      className="focus-visible:ring-1 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      {t(
                        "recruitmentAdmin.form.sections.description",
                        "Nội dung"
                      )}
                    </Label>
                    <Controller
                      name={`contentSections.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <AppRichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t(
                            "recruitmentAdmin.form.sections.descriptionPlaceholder",
                            "Nhập nội dung chi tiết..."
                          )}
                          height="300px"
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel", "Huỷ")}
        </Button>
        <AppButton
          label={t("recruitmentAdmin.form.buttons.save", "Lưu tin tuyển dụng")}
          loading={isLoading}
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
