import { Save, Upload, X } from "lucide-react";
import { useServiceForm, type ServiceFormData } from "./hooks/use-service-form";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import {
  CompanyService,
  ServiceStatus,
  ThemeVariant,
} from "@/services/api/servicesService";
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
  Tabs,
  Textarea,
  TagsInput,
  NumberInput,
  LoadingOverlay,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

// Helper to create a simple list-only editor
const useListEditor = (content: string, onChange: (html: string) => void) => {
  const isUpdatingRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: [StarterKit.configure({ link: {} })],
    content,
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        const html = editor.getHTML();
        onChangeRef.current(html);
      }
    },
  });

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentContent = editor.getHTML();
      // Only update if content is different and not empty initial state
      if (
        content !== currentContent &&
        !(content === "" && currentContent === "<p></p>")
      ) {
        isUpdatingRef.current = true;
        editor.commands.setContent(content || "");
        isUpdatingRef.current = false;
      }
    }
  }, [content, editor]);

  return editor;
};

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
  isSaving?: boolean; // Kept for compatibility, but not used for overlay
}) {
  const { t } = useTranslation();

  const {
    register,
    setValue,
    watch,

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

  // Ensure cta_link has a default value
  useEffect(() => {
    if (!watchAll.cta_link) {
      setValue("cta_link", "", { shouldValidate: true });
    }
  }, [watchAll.cta_link, setValue]);

  // Also trigger validation on mount
  useEffect(() => {
    // Trigger initial validation
    setValue("title", watchAll.title, { shouldValidate: true });
  }, []);

  // Editors
  const shortDescriptionEditor = useListEditor(
    watchAll.short_description || "",
    (html) => {
      setValue("short_description", html, { shouldValidate: true });
    }
  );
  const contentEditor = useListEditor(watchAll.content || "", (html) => {
    setValue("content", html, { shouldValidate: true });
  });
  const featuresEditor = useListEditor(watchAll.features || "", (html) => {
    setValue("features", html, { shouldValidate: true });
  });
  const technologiesEditor = useListEditor(
    watchAll.technologies || "",
    (html) => {
      setValue("technologies", html, { shouldValidate: true });
    }
  );
  const benefitsEditor = useListEditor(watchAll.benefits || "", (html) => {
    setValue("benefits", html, { shouldValidate: true });
  });

  const renderInput = (
    id: keyof ServiceFormData,
    label: string,
    required?: boolean
  ) => (
    <TextInput
      id={id as string}
      label={label}
      {...register(id as any)}
      error={errors[id]?.message as string}
      withAsterisk={required}
    />
  );

  const renderRichTextEditor = (
    editor: any,
    label: string,
    required?: boolean
  ) => {
    if (!editor) {
      return (
        <div className="col-span-2 space-y-1">
          <label className="mantine-Input-label">
            {label}
            {required && (
              <span className="mantine-Input-asterisk text-red-500"> *</span>
            )}
          </label>
          <div className="mantine-RichTextEditor-root">Loading editor...</div>
        </div>
      );
    }

    return (
      <div className="col-span-2 space-y-1">
        <label className="mantine-Input-label">
          {label}
          {required && (
            <span className="mantine-Input-asterisk text-red-500"> *</span>
          )}
        </label>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>
      </div>
    );
  };

  return (
    <Card withBorder shadow="sm" radius="md" style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isSubmitting}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={4}>
          {isEditing
            ? t("serviceForm.editTitle")
            : t("serviceForm.createTitle")}
        </Title>
      </Card.Section>

      <form onSubmit={onSubmitForm}>
        <Tabs defaultValue="general">
          <Tabs.List>
            <Tabs.Tab value="general">{t("serviceForm.tabs.general")}</Tabs.Tab>
            <Tabs.Tab value="content">{t("serviceForm.tabs.content")}</Tabs.Tab>
            <Tabs.Tab value="config">{t("serviceForm.tabs.config")}</Tabs.Tab>
            <Tabs.Tab value="seo">{t("serviceForm.tabs.seo")}</Tabs.Tab>
          </Tabs.List>

          {/* General Info Tab */}
          <Tabs.Panel value="general" pt="md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("title", t("serviceForm.title"), true)}
              {renderInput("slug", t("serviceForm.slug"), true)}
              {renderInput("subtitle", t("serviceForm.subtitle"))}
              {renderInput("icon", t("serviceForm.icon"))}
              <div className="col-span-2">
                {renderRichTextEditor(
                  shortDescriptionEditor,
                  t("serviceForm.shortDescription"),
                  true
                )}
              </div>
              <div className="col-span-2 space-y-2">
                <Text size="sm" fw={500}>
                  {t("serviceForm.images")}{" "}
                  <span className="text-red-500">*</span>
                </Text>
                <FileButton
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                >
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
                  <SimpleGrid cols={5} mt="sm">
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
                          className="h-32 w-full object-contain rounded border"
                        />
                      </Indicator>
                    ))}
                  </SimpleGrid>
                )}
              </div>
              {renderInput("alt_text", t("serviceForm.alt_text"))}
            </div>
          </Tabs.Panel>

          {/* Content Tab */}
          <Tabs.Panel value="content" pt="md">
            <div className="grid grid-cols-1 gap-6">
              {renderRichTextEditor(contentEditor, t("serviceForm.content"))}
              {renderRichTextEditor(featuresEditor, t("serviceForm.features"))}
              {renderRichTextEditor(
                technologiesEditor,
                t("serviceForm.technologies")
              )}
              {renderRichTextEditor(benefitsEditor, t("serviceForm.benefits"))}
            </div>
          </Tabs.Panel>

          {/* Config Tab */}
          <Tabs.Panel value="config" pt="md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label={t("serviceForm.status")}
                value={watchAll.status}
                onChange={(value) => setValue("status", value as ServiceStatus)}
                data={Object.values(ServiceStatus).map((s) => ({
                  label: t(`serviceForm.statusOptions.${s.toLowerCase()}`),
                  value: s,
                }))}
                withAsterisk
              />
              <Select
                label={t("serviceForm.theme_variant")}
                value={watchAll.theme_variant}
                onChange={(value) =>
                  setValue("theme_variant", value as ThemeVariant)
                }
                data={Object.values(ThemeVariant).map((v) => ({
                  label: t(
                    `serviceForm.themeVariantOptions.${v.toLowerCase()}`
                  ),
                  value: v,
                }))}
                withAsterisk
              />
              <NumberInput
                label={t("serviceForm.order")}
                value={watchAll.order_index}
                onChange={(value) => setValue("order_index", Number(value))}
                min={0}
              />
              <Switch
                label={t("serviceForm.featured")}
                checked={watchAll.is_featured}
                onChange={(event) =>
                  setValue("is_featured", event.currentTarget.checked)
                }
              />
              {renderInput("customers", t("serviceForm.customers"))}
              {renderInput("cta_label", t("serviceForm.cta_label"), true)}
              {renderInput("cta_link", t("serviceForm.cta_link"), true)}
              <div className="col-span-2">
                <TagsInput
                  label={t("serviceForm.tags")}
                  value={watchAll.tags}
                  onChange={(tags) => setValue("tags", tags)}
                  placeholder={t("serviceForm.tagsPlaceholder")}
                />
              </div>
            </div>
          </Tabs.Panel>

          {/* SEO Tab */}
          <Tabs.Panel value="seo" pt="md">
            <div className="grid grid-cols-1 gap-6">
              {renderInput("seo_title", t("serviceForm.seo_title"))}
              <Textarea
                label={t("serviceForm.seo_description")}
                {...register("seo_description")}
                rows={4}
              />
            </div>
          </Tabs.Panel>
        </Tabs>

        <Card.Section withBorder inheritPadding py="sm" mt="md">
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
        </Card.Section>
      </form>
    </Card>
  );
}
