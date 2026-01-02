import {
  Button,
  Card,
  Text,
  Group,
  Stack,
  Center,
  Loader,
  Title,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useProductForm } from "./hooks/use-product-form";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { DescriptionSection } from "./sections/DescriptionSection";
import { DetailedDescriptionSection } from "./sections/DetailedDescriptionSection";
import { ImagesSection } from "./sections/ImagesSection";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function ProductForm({
  isEditing,
  form,
  onSubmit,
  onCancel,
  isSaving,
  categories,
}: {
  isEditing: boolean;
  form: any;
  onSubmit: (finalForm: any) => Promise<void>;
  onCancel?: () => void;
  isSaving: boolean;
  categories: { id: number; name: string }[];
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    errors,
    shortDescriptions,
    imageFiles,
    handleImageSelect,
    removeImageFile,
    onSubmitForm,
    onSubmitError,
    formatPrice,
    resetForm,
    watchedPrice,
    watchedCategoryId,
    isLoadingDetailed,
  } = useProductForm({ isEditing, form, onSubmit }, categories);

  return (
    <form onSubmit={handleSubmit(onSubmitForm, onSubmitError)}>
      <Stack gap="xl">
        <Card withBorder radius="lg" p="xl" shadow="sm">
          <Title order={3} mb="lg" c={textColor}>
            {t("productsPage.admin.form.sections.basicInfo")}
          </Title>
          <BasicInfoSection
            register={register}
            watchedPrice={Number(watchedPrice) || 0}
            formatPrice={formatPrice}
            watchedCategoryId={watchedCategoryId}
            setValue={setValue as any}
            errors={errors}
            categories={categories}
          />
        </Card>

        <Card withBorder radius="lg" p="xl" shadow="sm">
          <DescriptionSection
            shortDescriptions={shortDescriptions}
            register={register}
          />
        </Card>

        <Card withBorder radius="lg" p="xl" shadow="sm">
          <Title order={3} mb="lg" c={textColor}>
            {t("productsPage.admin.form.sections.detailedDescription")}
          </Title>
          {isLoadingDetailed ? (
            <Center h={300}>
              <Loader size="lg" />
              <Text ml="md" size="lg">
                {t("productsPage.admin.form.labels.loadingDetailed")}
              </Text>
            </Center>
          ) : (
            <DetailedDescriptionSection control={control} />
          )}
        </Card>

        <Card withBorder radius="lg" p="xl" shadow="sm">
          <Title order={3} mb="lg" c={textColor}>
            {t("productsPage.admin.form.sections.images")}
          </Title>
          <ImagesSection
            imageFiles={imageFiles}
            handleImageSelect={handleImageSelect as any}
            removeImageFile={removeImageFile}
          />
        </Card>

        <Card
          withBorder
          radius="lg"
          p="md"
          shadow="md"
          pos="sticky"
          bottom={10}
          style={{
            zIndex: 10,
            backgroundColor:
              theme === "dark"
                ? "rgba(36, 36, 36, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Group justify="flex-end">
            <Button
              type="button"
              variant="subtle"
              size="lg"
              color="gray"
              onClick={() => {
                resetForm();
                onCancel?.();
              }}
              disabled={isSaving}
            >
              {t("productsPage.admin.form.labels.cancel")}
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              size="lg"
              leftSection={<IconDeviceFloppy size={22} />}
              px="xl"
            >
              {isEditing
                ? t("productsPage.admin.form.labels.update")
                : t("productsPage.admin.form.labels.save")}
            </Button>
          </Group>
        </Card>
      </Stack>
    </form>
  );
}
