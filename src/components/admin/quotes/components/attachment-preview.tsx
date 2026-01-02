import { ActionIcon, Group, Paper, Text, Tooltip } from "@mantine/core";
import {
  IconFile,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconFileTypeXls,
  IconFileZip,
  IconPhoto,
  IconDownload,
} from "@tabler/icons-react";

interface AttachmentPreviewProps {
  url: string;
}

const getFileIcon = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase() || "";
  const iconProps = { size: 32, stroke: 1.5 };

  if (["pdf"].includes(extension))
    return <IconFileTypePdf {...iconProps} className="text-red-500" />;
  if (["doc", "docx"].includes(extension))
    return <IconFileTypeDoc {...iconProps} className="text-blue-500" />;
  if (["xls", "xlsx"].includes(extension))
    return <IconFileTypeXls {...iconProps} className="text-green-500" />;
  if (["zip", "rar", "7z"].includes(extension))
    return <IconFileZip {...iconProps} className="text-yellow-500" />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension))
    return <IconPhoto {...iconProps} className="text-purple-500" />;
  if (["dwg", "dxf"].includes(extension))
    return <IconFile {...iconProps} className="text-orange-500" />;

  return <IconFile {...iconProps} className="text-gray-500" />;
};

const getFileName = (url: string) => {
  try {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const segments = pathname.split("/");
    return decodeURIComponent(segments[segments.length - 1] || "file-dinh-kem");
  } catch {
    return url.split("/").pop() || "file-dinh-kem";
  }
};

export function AttachmentPreview({ url }: AttachmentPreviewProps) {
  const fileName = getFileName(url);

  return (
    <Paper p="md" withBorder radius="md">
      <Group justify="space-between">
        <Group gap="md">
          {getFileIcon(url)}
          <Text size="sm" fw={500} className="truncate max-w-xs">
            {fileName}
          </Text>
        </Group>
        <Tooltip label="Tải xuống">
          <ActionIcon
            component="a"
            href={url}
            download
            variant="light"
            size="lg"
          >
            <IconDownload size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}
