import {
  Button,
  Badge,
  Card,
  Tabs,
  Text,
  Group,
  Stack,
  Box,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useProductForm } from "./hooks/use-product-form";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { DescriptionSection } from "./sections/DescriptionSection";
import { TechnicalSpecsSection } from "./sections/TechnicalSpecsSection";
import { ImagesSection } from "./sections/ImagesSection";

export default function ProductForm({
  isEditing,
  form,
  setForm,
  onSubmit,
  onCancel,
  isSaving,
  categories,
}: {
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
  onCancel?: () => void;
  isSaving: boolean;
  categories: { id: number; name: string }[];
}) {
  const {
    currentTab,
    setCurrentTab,
    register,
    handleSubmit,
    setValue,
    errors,
    featuresArray,
    applicationsArray,
    materialsArray,
    imageFiles,
    handleImageSelect,
    removeImageFile,
    onSubmitForm,
    onSubmitError,
    formatPrice,
    resetForm,
    watchedPrice,
    watchedCategoryId,
  } = useProductForm({ isEditing, form, setForm, onSubmit }, categories);

  const TABS = [
    { value: "basic", label: "Thông tin cơ bản" },
    { value: "description", label: "Mô tả chi tiết" },
    { value: "technical", label: "Thông số kỹ thuật" },
    { value: "images", label: "Hình ảnh" },
  ];

  const currentTabInfo = TABS.find((t) => t.value === currentTab);
  const currentTabIndex = TABS.findIndex((t) => t.value === currentTab);

  return (
    <Card withBorder radius="md" p={0}>
      <form onSubmit={handleSubmit(onSubmitForm, onSubmitError)}>
        <Stack p="md">
          <Tabs
            value={currentTab}
            onChange={(v) => v && setCurrentTab(v)}
            variant="pills"
            radius="md"
          >
            <Tabs.List grow>
              {TABS.map((tab) => (
                <Tabs.Tab key={tab.value} value={tab.value}>
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <Box pt="md">
              <Tabs.Panel value="basic">
                <BasicInfoSection
                  register={register}
                  watchedPrice={Number(watchedPrice) || 0}
                  formatPrice={formatPrice}
                  watchedCategoryId={watchedCategoryId}
                  setValue={setValue as any}
                  errors={errors}
                  categories={categories}
                />
              </Tabs.Panel>

              <Tabs.Panel value="description">
                <DescriptionSection
                  register={register}
                  featureFields={featuresArray.fields}
                  appendFeature={featuresArray.append as any}
                  removeFeature={featuresArray.remove as any}
                  applicationFields={applicationsArray.fields}
                  appendApplication={applicationsArray.append as any}
                  removeApplication={applicationsArray.remove as any}
                  materialFields={materialsArray.fields}
                  appendMaterial={materialsArray.append as any}
                  removeMaterial={materialsArray.remove as any}
                />
              </Tabs.Panel>

              <Tabs.Panel value="technical">
                <TechnicalSpecsSection register={register} />
              </Tabs.Panel>

              <Tabs.Panel value="images">
                <ImagesSection
                  imageFiles={imageFiles}
                  handleImageSelect={handleImageSelect as any}
                  removeImageFile={removeImageFile}
                />
              </Tabs.Panel>
            </Box>
          </Tabs>
        </Stack>

        <Group
          justify="space-between"
          p="md"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Group gap="xs">
            <Badge variant="outline" color="gray">
              Tab {currentTabIndex + 1}/{TABS.length}
            </Badge>
            <Text size="sm" c="dimmed">
              {currentTabInfo?.label}
            </Text>
          </Group>
          <Group>
            <Button
              type="button"
              variant="default"
              onClick={() => {
                resetForm();
                onCancel?.();
              }}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={isSaving}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {isEditing ? "Cập nhật" : "Lưu sản phẩm"}
            </Button>
          </Group>
        </Group>
      </form>
    </Card>
  );
}
