import { useTranslation } from "react-i18next";
import { useNewsForm } from "../hooks/use-news-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { News, NewsFormData } from "../types";
import { useTheme } from "@/hooks/useTheme";
import AppButton from "@/components/atoms/app-button";
import { Controller } from "react-hook-form";
import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";

interface NewsFormProps {
  news?: Partial<News>;
  onSubmit: (data: NewsFormData) => Promise<void>;
  onCancel: () => void;
}

export default function NewsForm({ news, onSubmit, onCancel }: NewsFormProps) {
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
  } = useNewsForm({ news, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {t("newsAdmin.form.labels.title", "Tiêu đề")} *
          </Label>
          <Input
            id="title"
            {...register("title", { required: true })}
            placeholder={t("newsAdmin.form.placeholders.title", "Nhập tiêu đề")}
            className="focus-visible:ring-1 focus-visible:ring-offset-0"
          />
          {errors.title && (
            <Text c="red" size="sm">
              {t(
                "newsAdmin.form.validation.titleRequired",
                "Vui lòng nhập tiêu đề"
              )}
            </Text>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">
            {t("newsAdmin.form.labels.subtitle", "Tiêu đề phụ")}
          </Label>
          <Input
            id="subtitle"
            {...register("subtitle")}
            placeholder={t(
              "newsAdmin.form.placeholders.subtitle",
              "Nhập tiêu đề phụ"
            )}
            className="focus-visible:ring-1 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Main Image Upload */}
      <div className="space-y-2">
        <Label>{t("newsAdmin.form.labels.image", "Ảnh bìa")}</Label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <FileButton
              onChange={handleMainImageChange}
              accept="image/png,image/jpeg,image/webp"
            >
              {(props) => (
                <Button type="button" variant="outline" {...props}>
                  <IconUpload className="w-4 h-4 mr-2" />
                  {t("common.upload", "Tải ảnh lên")}
                </Button>
              )}
            </FileButton>
            {mainImageFile?.url && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveMainImage}
              >
                <IconX className="w-4 h-4" />
              </Button>
            )}
          </div>
          {mainImageFile?.url && (
            <Image
              src={mainImageFile.url}
              alt="Preview"
              h={150}
              w="auto"
              fit="contain"
              radius="md"
              className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 max-w-[200px]"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          {/* We need to hook checkboxes to react-hook-form manually with Controller or simple register if compatible */}
          {/* Checkbox from ui/checkbox usually needs checked/onCheckedChange. Using controller is best or manual mapping. */}
          {/* Reverting to simple Input type=checkbox for speed or map events? */}
          {/* Let's try native input hidden with label styling or use Checkbox properly controlled. */}
          {/* Since we have register, simpler to use native or Controller. But useNewsForm returns register. */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("newsAdmin.form.labels.featured", "Tin nổi bật")}
            </span>
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("newsAdmin.form.labels.active", "Kích hoạt")}
            </span>
          </label>
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
            {t("newsAdmin.form.sections.title", "Nội dung chi tiết")}
          </Title>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ title: "", description: "", image: "" })}
          >
            <IconPlus className="h-4 w-4 mr-1" />
            {t("newsAdmin.form.sections.add", "Thêm section")}
          </Button>
        </Group>

        {fields.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {t(
              "newsAdmin.form.sections.empty",
              "Chưa có section nào. Nhấn nút trên để thêm."
            )}
          </Text>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => {
              return (
                <Card key={field.id} withBorder radius="md" p="md">
                  <Group justify="space-between" mb="sm">
                    <Text fw={600}>Section {index + 1}</Text>
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
                          "newsAdmin.form.sections.sectionTitle",
                          "Tiêu đề section"
                        )}
                      </Label>
                      <Input
                        {...register(`contentSections.${index}.title` as const)}
                        placeholder={t(
                          "newsAdmin.form.sections.sectionTitlePlaceholder",
                          "Nhập tiêu đề"
                        )}
                        className="focus-visible:ring-1 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">
                        {t("newsAdmin.form.sections.description", "Nội dung")}
                      </Label>
                      <Controller
                        name={`contentSections.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <AppRichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t(
                              "newsAdmin.form.sections.descriptionPlaceholder",
                              "Nhập nội dung chi tiết..."
                            )}
                            height="300px"
                          />
                        )}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      <div className="flex gap-2 justify-end pt-4">
        <AppButton
          variant="outline-primary"
          onClick={onCancel}
          label={t("common.cancel", "Huỷ")}
          showArrow={false}
          size="sm"
        />
        <AppButton
          htmlType="submit"
          loading={isLoading}
          label={
            isLoading
              ? t("common.saving", "Đang lưu...")
              : t("newsAdmin.form.buttons.save", "Lưu tin tức")
          }
          showArrow={false}
          size="sm"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
