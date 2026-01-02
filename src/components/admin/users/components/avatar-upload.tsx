import { useState, useEffect } from "react";
import {
  Text,
  Group,
  Stack,
  Avatar,
  ActionIcon,
  rem,
  Box,
  Loader,
} from "@mantine/core";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { uploadService } from "@/services/api/uploadService";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

interface UserAvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
  disabled?: boolean;
  userId?: number;
}

export function UserAvatarUpload({
  value,
  onChange,
  onFileSelect,
  disabled = false,
  userId,
}: UserAvatarUploadProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const textColor = theme === "dark" ? "white" : "black";

  useEffect(() => {
    const resolveUrl = async () => {
      if (value) {
        const url = await uploadService.getFileUrl(value);
        setPreview(url);
      } else {
        setPreview(undefined);
      }
    };
    resolveUrl();
  }, [value]);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setLoading(true);
      // Create local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (onFileSelect) {
        onFileSelect(file);
        setLoading(false);
        return;
      }

      // Use uploadToMinio for direct client-side upload
      const folder = userId ? `avatars/${userId}` : "avatars";
      const result = await uploadService.uploadToMinio(file, folder);

      // result.url from uploadToMinio is the key (public_id)
      const key = result.url;

      // Get displayable URL for the key
      const displayUrl = await uploadService.getFileUrl(key);

      onChange(key); // Save the key in database
      setPreview(displayUrl);
      toast.success("Tải ảnh đại diện thành công");
    } catch (error) {
      console.error("Upload avatar failed", error);
      toast.error("Tải ảnh thất bại. Vui lòng thử lại.");

      // Rollback
      if (value) {
        const url = await uploadService.getFileUrl(value);
        setPreview(url);
      } else {
        setPreview(undefined);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setPreview(undefined);
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c={textColor}>
        Ảnh đại diện
      </Text>

      <Box style={{ position: "relative", width: "fit-content" }}>
        <Dropzone
          onDrop={handleUpload}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          disabled={disabled || loading}
          multiple={false}
          radius="xl"
          styles={{
            root: {
              width: rem(120),
              height: rem(120),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: 0,
            },
          }}
        >
          {preview ? (
            <Avatar
              src={preview}
              size={120}
              radius={120}
              className="border-2 border-muted shadow-sm"
            >
              <IconPhoto size={40} />
            </Avatar>
          ) : (
            <Stack align="center" gap={4}>
              <IconUpload size={24} color="gray" />
              <Text size="xs" c="dimmed" ta="center">
                Tải ảnh
              </Text>
            </Stack>
          )}

          {loading && (
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                zIndex: 5,
              }}
            >
              <Loader size="sm" color="white" />
            </Box>
          )}
        </Dropzone>

        {!disabled && !loading && preview && (
          <Group
            gap={4}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <ActionIcon
              color="red"
              variant="filled"
              size="sm"
              radius="xl"
              onClick={handleRemove}
              title="Xóa ảnh"
            >
              <IconX size={12} />
            </ActionIcon>
          </Group>
        )}
      </Box>

      <Text size="xs" c="dimmed">
        Hỗ trợ JPG, PNG. Tối đa 5MB.
      </Text>
    </Stack>
  );
}
