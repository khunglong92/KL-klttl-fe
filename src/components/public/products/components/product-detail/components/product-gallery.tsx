import { useState, useEffect } from "react";
import { ActionIcon, Stack, Paper, Text, Box } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import { IconZoomIn } from "@tabler/icons-react";
import { ImageWithFallback } from "@/components/public/figma/ImageWithFallback";
import { useTheme } from "@/hooks/useTheme";
import "@mantine/carousel/styles.css";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [embla, setEmbla] = useState<UseEmblaCarouselType[1] | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Đồng bộ carousel khi click vào thumbnail
  useEffect(() => {
    if (embla) {
      embla.scrollTo(currentImage);
    }
  }, [currentImage, embla]);

  if (!images || images.length === 0) {
    return (
      <Stack gap="md">
        <Paper
          className="relative aspect-square overflow-hidden flex items-center justify-center"
          radius="md"
          style={{
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)",
          }}
        >
          <Text c={isDark ? "gray.5" : "gray.4"}>No images available</Text>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {/* Main Image Carousel */}
      <Paper
        className="relative aspect-square overflow-hidden"
        radius="md"
        shadow="sm"
        style={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <Carousel
          withIndicators={images.length > 1}
          withControls={images.length > 1}
          getEmblaApi={setEmbla}
          onSlideChange={setCurrentImage}
          classNames={{
            root: "h-full",
            viewport: "h-full",
            container: "h-full",
            slide: "h-full",
            control: "border-0",
            indicator: "transition-all",
          }}
          styles={{
            control: {
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              border: "none",
              color: isDark ? "white" : "black",
              "&[data-inactive]": {
                opacity: 0,
                cursor: "default",
              },
            },
            indicator: {
              width: 8,
              height: 8,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.4)"
                : "rgba(0, 0, 0, 0.4)",
              "&[dataActive]": {
                backgroundColor: isDark ? "#ffa94d" : "#fd7e14",
                width: 24,
              },
            },
          }}
        >
          {images.map((image, index) => (
            <Carousel.Slide key={index}>
              <AppThumbnailImage
                src={image}
                alt={`Product ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Zoom Button */}
        <ActionIcon
          variant="filled"
          color={isDark ? "dark.4" : "gray.0"}
          size="lg"
          radius="md"
          className="absolute right-2 top-2 z-10"
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.6)"
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
          }}
        >
          <IconZoomIn size={20} color={isDark ? "white" : "black"} />
        </ActionIcon>

        {/* Image Counter */}
        {images.length > 1 && (
          <Box
            className="absolute left-2 top-2 z-10 px-3 py-1 rounded-md"
            style={{
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Text size="sm" fw={600} c={isDark ? "white" : "black"}>
              {currentImage + 1} / {images.length}
            </Text>
          </Box>
        )}
      </Paper>

      {/* Thumbnails Carousel */}
      {images.length > 1 && (
        <Carousel
          slideSize="20%"
          slideGap="sm"
          draggable
          withControls={images.length > 5}
          classNames={{
            control: "border-0",
          }}
          styles={{
            control: {
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              border: "none",
              color: isDark ? "white" : "black",
              "&[data-inactive]": {
                opacity: 0,
                cursor: "default",
              },
            },
          }}
        >
          {images.map((image, index) => (
            <Carousel.Slide key={index}>
              <Paper
                onClick={() => setCurrentImage(index)}
                className="aspect-square overflow-hidden cursor-pointer transition-all hover:scale-105"
                radius="md"
                withBorder
                style={{
                  borderWidth: currentImage === index ? 3 : 1,
                  borderColor:
                    currentImage === index
                      ? isDark
                        ? "#ffa94d"
                        : "#fd7e14"
                      : isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                  opacity: currentImage === index ? 1 : 0.6,
                }}
              >
                <ImageWithFallback
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </Paper>
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Stack>
  );
}
