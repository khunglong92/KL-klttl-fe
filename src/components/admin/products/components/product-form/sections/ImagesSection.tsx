import {
  Text,
  Stack,
  Group,
  ActionIcon,
  Badge,
  SimpleGrid,
  AspectRatio,
  Box,
  Center,
  rem,
  Card,
} from "@mantine/core";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import type { ImageItem } from "../hooks/use-product-form";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  imageFiles: ImageItem[];
  handleImageSelect: (files: File[]) => void;
  removeImageFile: (index: number) => void;
}

export function ImagesSection({
  imageFiles,
  handleImageSelect,
  removeImageFile,
}: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <Stack gap="lg">
      <Box>
        <Text size="sm" c="dimmed">
          {t("productsPage.admin.form.labels.imageUploadHint")}
        </Text>
      </Box>

      <Dropzone
        onDrop={handleImageSelect}
        maxSize={10 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        disabled={imageFiles.length >= 12}
        radius="lg"
        bg={theme === "dark" ? "dark.7" : "gray.0"}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <Box ta="center">
            <Text size="xl" fw={600} inline c={textColor}>
              {t("common.dropzone.title", "Kéo thả hoặc nhấn để chọn file")}
            </Text>
            <Text size="sm" c="dimmed" inline mt={10}>
              {t("common.dropzone.subtitle", "Hỗ trợ JPG, PNG, GIF.")}{" "}
              {t("common.dropzone.selected", "Đã chọn")} {imageFiles.length}/12.
            </Text>
          </Box>
        </Group>
      </Dropzone>

      {imageFiles.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} mt="md" spacing="md">
          {imageFiles.map((item, index) => (
            <Card
              key={index}
              withBorder
              padding={0}
              radius="md"
              style={{ position: "relative" }}
              shadow="sm"
            >
              <AspectRatio ratio={1 / 1} style={{ position: "relative" }}>
                <AppThumbnailImage
                  src={item.preview || item.url}
                  alt={`Preview ${index + 1}`}
                />
                <ActionIcon
                  color="red"
                  variant="filled"
                  size="lg"
                  radius="xl"
                  className="w-8! h-8!"
                  onClick={() => removeImageFile(index)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  <IconX size={18} />
                </ActionIcon>
                {item.file && (
                  <Badge
                    variant="filled"
                    color="blue"
                    size="md"
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 10,
                    }}
                  >
                    {t("productsPage.admin.form.labels.newBadge")}
                  </Badge>
                )}
              </AspectRatio>
              {item.file && (
                <Box p="xs">
                  <Text size="xs" fw={500} truncate="end" c={textColor}>
                    {item.file.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </Box>
              )}
            </Card>
          ))}
        </SimpleGrid>
      )}

      {imageFiles.length === 0 && (
        <Center py="xl">
          <Text c="dimmed" size="lg">
            {t("common.noImages", "Chưa có hình ảnh nào được chọn")}
          </Text>
        </Center>
      )}
    </Stack>
  );
}
