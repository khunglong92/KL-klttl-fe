import {
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Switch,
  Group,
  Button,
  Card,
  Text,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import type { CompanyIntroFormState } from "../hooks/use-company-intro-crud";
import { useState, useEffect } from "react";
import { uploadService } from "@/services/api/uploadService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";

interface CompanyIntroFormProps {
  isEditing: boolean;
  form: CompanyIntroFormState;
  setForm: (form: CompanyIntroFormState) => void;
  onSubmit: (form: CompanyIntroFormState) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export function CompanyIntroForm({
  isEditing,
  form,
  setForm,
  onSubmit,
  onCancel,
  isSaving,
}: CompanyIntroFormProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  // File chưa upload - chờ submit mới upload
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  // Preview URL cho file đang chờ upload (local preview)
  const [localPreview, setLocalPreview] = useState<string>("");
  // Preview URL cho ảnh đã có trên server (presigned URL)
  const [serverPreviewUrl, setServerPreviewUrl] = useState<string>("");

  // Khi edit, lấy presigned URL từ key để hiển thị preview
  useEffect(() => {
    const resolveServerPreviewUrl = async () => {
      if (form.url && !pendingFile) {
        try {
          // Nếu đã là full URL (http/https), dùng trực tiếp
          if (
            form.url.startsWith("http://") ||
            form.url.startsWith("https://")
          ) {
            setServerPreviewUrl(form.url);
          } else {
            // Nếu là key, lấy presigned URL
            const resolvedUrl = await uploadService.getFileUrl(form.url);
            setServerPreviewUrl(resolvedUrl);
          }
        } catch (error) {
          console.warn("Failed to resolve preview URL:", error);
          setServerPreviewUrl(form.url);
        }
      } else if (!form.url) {
        setServerPreviewUrl("");
      }
    };
    resolveServerPreviewUrl();
  }, [form.url, pendingFile]);

  // Cleanup local preview URL khi component unmount
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  // Chọn file - chỉ tạo preview local, KHÔNG upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("admin.companyIntros.toast.imageOnly"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("admin.companyIntros.toast.fileTooLarge"));
      return;
    }

    // Cleanup old preview URL
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    // Tạo local preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setPendingFile(file);
  };

  // Submit - upload file (nếu có) rồi mới gọi API
  const handleSubmit = async () => {
    setUploading(true);
    try {
      let finalUrl = form.url;

      // Nếu có file đang chờ upload
      if (pendingFile) {
        toast.loading(t("admin.companyIntros.toast.uploading"), {
          id: "upload-image",
        });
        const result = await uploadService.uploadImage(
          pendingFile,
          "company-intros"
        );
        finalUrl = result.public_id; // Lưu key, không phải URL
        toast.dismiss("upload-image");
        toast.success(t("admin.companyIntros.toast.uploadSuccess"));
      }

      // Gọi API với form đã cập nhật URL
      await onSubmit({ ...form, url: finalUrl });

      // Reset pending file sau khi submit thành công
      setPendingFile(null);
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setLocalPreview("");
      }
    } catch (error: any) {
      toast.error(error?.message || t("admin.companyIntros.toast.error"));
    } finally {
      setUploading(false);
    }
  };

  // Preview URL để hiển thị: ưu tiên local preview (file mới chọn) > server preview (ảnh đã có)
  const displayPreviewUrl = localPreview || serverPreviewUrl;

  return (
    <Card withBorder radius="md" p="lg">
      <Stack gap="md">
        {/* Image Upload */}
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <Text size="sm" fw={500}>
            {t("admin.companyIntros.form.imageLabel")}
          </Text>

          {displayPreviewUrl && (
            <AppThumbnailImage
              src={displayPreviewUrl}
              alt="Preview"
              width={600}
              height={600}
              fit="cover"
            />
          )}

          {pendingFile && (
            <Text size="xs" c="blue">
              📎 {pendingFile.name} - Sẽ upload khi lưu
            </Text>
          )}

          <Group>
            <Button
              component="label"
              variant="outline"
              leftSection={<IconUpload size={16} />}
              disabled={uploading || isSaving}
            >
              {t("admin.companyIntros.form.uploadButton")}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </Button>
            <Text size="xs" c="dimmed">
              {t("admin.companyIntros.form.urlHint")}
            </Text>
          </Group>

          <TextInput
            placeholder={t("admin.companyIntros.form.urlPlaceholder")}
            value={form.url}
            onChange={(e) => {
              setForm({ ...form, url: e.currentTarget.value });
              // Clear pending file nếu user nhập URL thủ công
              if (pendingFile) {
                setPendingFile(null);
                if (localPreview) {
                  URL.revokeObjectURL(localPreview);
                  setLocalPreview("");
                }
              }
            }}
            description={t("admin.companyIntros.form.urlDescription")}
          />
        </div>

        {/* Description */}
        <Textarea
          label={t("admin.companyIntros.form.descriptionLabel")}
          placeholder={t("admin.companyIntros.form.descriptionPlaceholder")}
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.currentTarget.value })
          }
        />

        {/* Sub Description */}
        <Textarea
          label={t("admin.companyIntros.form.subDescriptionLabel")}
          placeholder={t("admin.companyIntros.form.subDescriptionPlaceholder")}
          rows={2}
          value={form.subDescription || ""}
          onChange={(e) =>
            setForm({ ...form, subDescription: e.currentTarget.value })
          }
        />

        {/* Order Index */}
        <NumberInput
          label={t("admin.companyIntros.form.orderLabel")}
          description={t("admin.companyIntros.form.orderDescription")}
          min={0}
          value={form.orderIndex}
          onChange={(val) =>
            setForm({ ...form, orderIndex: typeof val === "number" ? val : 0 })
          }
        />

        {/* Is Active */}
        <Group>
          <Switch
            label={t("admin.companyIntros.form.activeLabel")}
            description={t("admin.companyIntros.form.activeDescription")}
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.currentTarget.checked })
            }
            color="green"
          />
        </Group>

        {/* Actions */}
        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={onCancel}
            disabled={isSaving || uploading}
          >
            {t("admin.companyIntros.form.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSaving || uploading}
            disabled={!form.url.trim() && !pendingFile}
          >
            {uploading
              ? t("admin.companyIntros.toast.uploadingButton")
              : isEditing
                ? t("admin.companyIntros.form.update")
                : t("admin.companyIntros.form.save")}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
