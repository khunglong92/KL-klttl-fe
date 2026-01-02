import { ActionIcon, Group, Paper, Progress, Text } from "@mantine/core";
import {
  IconFile,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconFileTypeXls,
  IconFileZip,
  IconPhoto,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

interface FileUploadPreviewProps {
  file: File | null;
  uploadProgress?: number;
  uploadStatus?: "idle" | "uploading" | "success" | "error";
  onRemove: () => void;
  error?: string;
}

// Get file icon based on file type
const getFileIcon = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const iconProps = { size: 32, stroke: 1.5 };

  switch (extension) {
    case "pdf":
      return <IconFileTypePdf {...iconProps} className="text-red-500" />;
    case "doc":
    case "docx":
      return <IconFileTypeDoc {...iconProps} className="text-blue-500" />;
    case "xls":
    case "xlsx":
      return <IconFileTypeXls {...iconProps} className="text-green-500" />;
    case "zip":
    case "rar":
    case "7z":
      return <IconFileZip {...iconProps} className="text-yellow-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <IconPhoto {...iconProps} className="text-purple-500" />;
    case "dwg":
    case "dxf":
      return <IconFile {...iconProps} className="text-orange-500" />;
    default:
      return <IconFile {...iconProps} className="text-gray-500" />;
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function FileUploadPreview({
  file,
  uploadProgress = 0,
  uploadStatus = "idle",
  onRemove,
  error,
}: FileUploadPreviewProps) {
  if (!file) return null;

  const isUploading = uploadStatus === "uploading";
  const isSuccess = uploadStatus === "success";
  const isError = uploadStatus === "error" || !!error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Paper
        p="md"
        withBorder
        className={`relative ${
          isError
            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
            : isSuccess
              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
              : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <Group gap="md" wrap="nowrap">
          {/* File Icon */}
          <div className="shrink-0">{getFileIcon(file)}</div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <Text size="sm" fw={500} className="truncate">
              {file.name}
            </Text>
            <Text size="xs" c="dimmed">
              {formatFileSize(file.size)}
            </Text>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-2">
                <Progress
                  value={uploadProgress}
                  size="sm"
                  color="blue"
                  animated
                />
                <Text size="xs" c="dimmed" mt={4}>
                  Đang tải lên... {uploadProgress}%
                </Text>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <Group gap={4} mt={4}>
                <IconCheck size={14} className="text-green-500" />
                <Text size="xs" c="green">
                  Tải lên thành công
                </Text>
              </Group>
            )}

            {/* Error Message */}
            {error && (
              <Text size="xs" c="red" mt={4}>
                {error}
              </Text>
            )}
          </div>

          {/* Remove Button */}
          <ActionIcon
            variant="subtle"
            color={isError ? "red" : "gray"}
            onClick={onRemove}
            disabled={isUploading}
          >
            <IconX size={18} />
          </ActionIcon>
        </Group>
      </Paper>
    </motion.div>
  );
}
