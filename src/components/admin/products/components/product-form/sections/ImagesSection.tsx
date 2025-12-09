import {
  Card,
  Title,
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
} from "@mantine/core";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import type { ImageItem } from "../hooks/use-product-form";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";

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
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack p="md">
        <Box>
          <Title order={4}>Hình ảnh sản phẩm</Title>
          <Text size="sm" c="dimmed">
            Tải lên hoặc kéo thả hình ảnh. Tối đa 10 ảnh, mỗi ảnh không quá
            10MB.
          </Text>
        </Box>

        <Dropzone
          onDrop={handleImageSelect}
          maxSize={10 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          disabled={imageFiles.length >= 10}
          radius="md"
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

            <div>
              <Text size="xl" inline>
                Kéo thả hoặc nhấn để chọn file
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Hỗ trợ JPG, PNG, GIF. Đã chọn {imageFiles.length}/10.
              </Text>
            </div>
          </Group>
        </Dropzone>

        {imageFiles.length > 0 && (
          <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} mt="md">
            {imageFiles.map((item, index) => (
              <Card
                key={index}
                withBorder
                padding={0}
                radius="md"
                style={{ position: "relative" }}
              >
                <AspectRatio ratio={1 / 1} style={{ position: "relative" }}>
                  <AppThumbnailImage
                    src={item.preview || item.url}
                    alt={`Preview ${index + 1}`}
                  />
                  {/* Nút xóa luôn hiển thị ở góc trên bên phải */}
                  <ActionIcon
                    color="red"
                    variant="filled"
                    size="lg"
                    radius="xl"
                    className="!w-8 !h-8"
                    onClick={() => removeImageFile(index)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <IconX size={18} />
                  </ActionIcon>
                  {item.file && (
                    <Badge
                      variant="filled"
                      color="blue"
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 10,
                      }}
                    >
                      Mới
                    </Badge>
                  )}
                </AspectRatio>
                {item.file && (
                  <Box p="xs">
                    <Text size="xs" truncate="end">
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
          <Center py="lg">
            <Text c="dimmed">Chưa có hình ảnh nào được chọn</Text>
          </Center>
        )}
      </Stack>
    </Card>
  );
}
