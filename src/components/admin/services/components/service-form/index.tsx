import { Save, Upload, X } from "lucide-react";
import { useServiceForm } from "./hooks/use-service-form";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import { CompanyService, ServiceStatus } from "@/services/api/servicesService";
import {
  Button,
  Card,
  Switch,
  Select,
  TextInput,
  Group,
  Title,
  FileButton,
  SimpleGrid,
  ActionIcon,
  Indicator,
  Text,
  Textarea,
  TagsInput,
  LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { DetailedDescriptionSection } from "./sections/DetailedDescriptionSection";

export default function ServiceForm({
  isEditing,
  form,
  onSubmit,
  onCancel,
}: {
  isEditing: boolean;
  form: Partial<CompanyService>;
  onSubmit: (finalForm: any) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}) {
  const { t } = useTranslation();

  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
    handleImageSelect,
    handleRemoveImage,
    previewUrls,
    pendingFiles,
    onSubmitForm,
    isSubmitting,
    resetFormState,
  } = useServiceForm({
    isEditing,
    form,
    onSubmit,
  });

  const watchAll = watch();

  return (
    <form onSubmit={onSubmitForm}>
      <LoadingOverlay
        visible={isSubmitting}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div className="flex flex-col gap-6">
        {/* Basic Info */}
        <Card withBorder radius="md" shadow="sm" p="xl">
          <Title order={4} mb="md">
            {isEditing
              ? t("serviceForm.editTitle", "Chỉnh sửa dịch vụ")
              : t("serviceForm.createTitle", "Thêm dịch vụ mới")}
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label={t("serviceForm.name", "Tiêu đề")}
              {...register("name")}
              error={errors.name?.message}
              withAsterisk
            />
            <Select
              label={t("serviceForm.status")}
              value={watchAll.status}
              onChange={(value) => setValue("status", value as ServiceStatus)}
              data={Object.values(ServiceStatus).map((s) => ({
                label: t(`serviceForm.statusOptions.${s.toLowerCase()}`, s),
                value: s,
              }))}
              withAsterisk
            />
            <div className="col-span-2">
              <Textarea
                label={t("serviceForm.shortDescription", "Mô tả ngắn")}
                {...register("short_description")}
                error={errors.short_description?.message}
                withAsterisk
                rows={3}
              />
            </div>
            <Switch
              label={t("serviceForm.featured")}
              checked={watchAll.is_featured}
              onChange={(event) =>
                setValue("is_featured", event.currentTarget.checked)
              }
              mt={5}
            />
          </div>
        </Card>

        {/* Images */}
        <Card withBorder radius="md" shadow="sm" p="xl">
          <Title order={4} mb="md">
            {t("serviceForm.images")} <span className="text-red-500">*</span>
          </Title>
          <div className="space-y-4">
            <FileButton onChange={handleImageSelect} accept="image/*" multiple>
              {(props) => (
                <Button
                  {...props}
                  variant="outline"
                  leftSection={<Upload size={14} />}
                >
                  {t("serviceForm.uploadImages")}
                </Button>
              )}
            </FileButton>
            {pendingFiles.length > 0 && (
              <Text size="sm" c="dimmed">
                {t("serviceForm.pendingImages", {
                  count: pendingFiles.length,
                })}
              </Text>
            )}
            {previewUrls && previewUrls.length > 0 && (
              <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }}>
                {previewUrls.map((url, index) => (
                  <Indicator
                    key={index}
                    inline
                    size={20}
                    offset={7}
                    position="top-end"
                    color="red"
                    withBorder
                    label={
                      <ActionIcon
                        size="xs"
                        color="white"
                        variant="transparent"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={12} />
                      </ActionIcon>
                    }
                  >
                    <AppThumbnailImage
                      src={url}
                      className="h-32 w-full object-cover rounded-md border"
                    />
                  </Indicator>
                ))}
              </SimpleGrid>
            )}
            {errors.images && (
              <Text c="red" size="xs">
                {errors.images.message}
              </Text>
            )}
          </div>
        </Card>

        {/* Detailed Description & Features */}
        <Card withBorder radius="md" shadow="sm" p="xl">
          <Title order={4} mb="md">
            {t("serviceForm.tabs.content", "Nội dung chi tiết")}
          </Title>
          <div className="flex flex-col gap-6">
            <DetailedDescriptionSection control={control} />

            <TagsInput
              label={t("serviceForm.features", "Hash tag")}
              value={watchAll.hashtags}
              onChange={(tags) => setValue("hashtags", tags)}
              placeholder={t(
                "serviceForm.featuresPlaceholder",
                "Enter để thêm hash tag"
              )}
              description={t(
                "serviceForm.featuresDesc",
                "Nhập các từ khóa tìm kiếm (dạng liệt kê)"
              )}
            />
          </div>
        </Card>

        {/* Sticky Footer Actions */}
        <Card
          withBorder
          radius="md"
          p="md"
          shadow="md"
          pos="sticky"
          bottom={10}
          style={{
            zIndex: 10,
            backdropFilter: "blur(8px)",
            backgroundColor: "var(--mantine-color-body)",
          }}
        >
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                resetFormState();
                onCancel?.();
              }}
              disabled={isSubmitting}
            >
              {t("serviceForm.cancel")}
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              leftSection={<Save size={16} />}
            >
              {t("serviceForm.save")}
            </Button>
          </Group>
        </Card>
      </div>
    </form>
  );
}
