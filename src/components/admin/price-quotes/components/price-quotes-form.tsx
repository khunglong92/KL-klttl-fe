import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  Title,
  Group,
  ActionIcon,
  Text,
  Image,
  FileButton,
} from "@mantine/core";
import { IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { PriceQuote, PriceQuoteFormData } from "../types";
import { useTheme } from "@/hooks/useTheme";
import { usePriceQuotesForm } from "../hooks/use-price-quotes-form";
import { Controller } from "react-hook-form";
import AppButton from "@/components/atoms/app-button";
import { AppRichTextEditor } from "@/components/common/app-rich-text-editor";

interface PriceQuotesFormProps {
  quote?: Partial<PriceQuote>;
  onSubmit: (data: PriceQuoteFormData) => Promise<void>;
  onCancel: () => void;
}

export default function PriceQuotesForm({
  quote,
  onSubmit,
  onCancel,
}: PriceQuotesFormProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const {
    register,
    control,
    handleSubmit,
    errors,
    isLoading,
    fields,
    append,
    mainImageFile,
    handleMainImageChange,
    handleRemoveMainImage,
    handleRemoveSection,
  } = usePriceQuotesForm({
    quote,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {t("priceQuotesAdmin.form.labels.title", "Tiêu đề")} *
          </Label>
          <Input
            id="title"
            {...register("title", { required: true })}
            placeholder={t(
              "priceQuotesAdmin.form.placeholders.title",
              "Nhập tiêu đề"
            )}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">
              {t("common.required", "Bắt buộc")}
            </span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">
            {t("priceQuotesAdmin.form.labels.subtitle", "Tiêu đề phụ")}
          </Label>
          <Input
            id="subtitle"
            {...register("subtitle")}
            placeholder={t(
              "priceQuotesAdmin.form.placeholders.subtitle",
              "Nhập tiêu đề phụ"
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("priceQuotesAdmin.form.labels.image", "Ảnh bìa")}</Label>
        <div className="space-y-4">
          {mainImageFile?.url ? (
            <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-border group">
              <Image
                src={mainImageFile.url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoveMainImage}
                >
                  <IconX size={20} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-border rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
              <FileButton
                onChange={handleMainImageChange}
                accept="image/png,image/jpeg,image/webp"
              >
                {(props) => (
                  <Button
                    {...props}
                    type="button"
                    variant="ghost"
                    className="h-full w-full flex flex-col gap-2"
                  >
                    <IconUpload size={32} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("common.clickToUpload", "Click để tải ảnh lên")}
                    </span>
                  </Button>
                )}
              </FileButton>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isFeatured"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
            {t("priceQuotesAdmin.form.labels.featured", "Nổi bật")}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isActive" className="font-normal cursor-pointer">
            {t("priceQuotesAdmin.form.labels.active", "Kích hoạt")}
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
            {t("priceQuotesAdmin.form.sections.title", "Nội dung chi tiết")}
          </Title>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ title: "", description: "", image: "" })}
          >
            <IconPlus className="h-4 w-4 mr-1" />
            {t("priceQuotesAdmin.form.sections.add", "Thêm section")}
          </Button>
        </Group>

        {fields.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {t(
              "priceQuotesAdmin.form.sections.empty",
              "Chưa có section nào. Nhấn nút trên để thêm."
            )}
          </Text>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
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
                        "priceQuotesAdmin.form.sections.sectionTitle",
                        "Tiêu đề section"
                      )}
                    </Label>
                    <Input
                      {...register(`contentSections.${index}.title` as const)}
                      placeholder={t(
                        "priceQuotesAdmin.form.sections.sectionTitlePlaceholder",
                        "Nhập tiêu đề"
                      )}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">
                      {t(
                        "priceQuotesAdmin.form.sections.description",
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
                            "priceQuotesAdmin.form.sections.descriptionPlaceholder",
                            "Nhập nội dung..."
                          )}
                          height="300px"
                        />
                      )}
                    />
                  </div>
                  {/* Removed manual image input as Rich Text handles it */}
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
          label={t("priceQuotesAdmin.form.buttons.save", "Lưu báo giá")}
          loading={isLoading}
          disabled={isLoading}
        />
      </div>
    </form>
  );
}
