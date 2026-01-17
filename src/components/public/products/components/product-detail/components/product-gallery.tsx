import { useState, useEffect } from "react";
import { ActionIcon, Stack, Paper, Text, Box, Modal } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import {
  IconZoomIn,
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (embla) {
      embla.scrollTo(currentImage);
    }
  }, [currentImage, embla]);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <Paper
        className="relative aspect-4/3 overflow-hidden flex items-center justify-center"
        radius="md"
        style={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Text c={isDark ? "gray.5" : "gray.4"}>No images available</Text>
      </Paper>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="w-full min-w-0">
        <Stack gap="xs">
          {/* Main Image - Compact size */}
          <Paper
            className="relative aspect-video max-h-[280px] overflow-hidden cursor-pointer group"
            radius="md"
            shadow="sm"
            onClick={openLightbox}
            style={{
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
            }}
          >
            <Carousel
              withIndicators={false}
              withControls={images.length > 1}
              getEmblaApi={setEmbla}
              onSlideChange={setCurrentImage}
              classNames={{
                root: "h-full",
                viewport: "h-full",
                container: "h-full",
                slide: "h-full",
                control: "border-0",
              }}
              styles={{
                control: {
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  border: "none",
                  color: isDark ? "white" : "black",
                  width: 32,
                  height: 32,
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
              }}
            >
              {images.map((image, index) => (
                <Carousel.Slide key={index}>
                  <AppThumbnailImage
                    src={image}
                    alt={`Product ${index + 1}`}
                    width="800"
                    height="600"
                    className="h-full w-full object-cover"
                  />
                </Carousel.Slide>
              ))}
            </Carousel>

            {/* Image Counter Badge */}
            {images.length > 1 && (
              <Box
                className="absolute left-3 top-3 px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: isDark
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(255, 255, 255, 0.9)",
                  color: isDark ? "white" : "black",
                }}
              >
                {currentImage + 1} / {images.length}
              </Box>
            )}

            {/* Zoom Icon Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full p-3">
                <IconZoomIn size={24} color="white" />
              </div>
            </div>
          </Paper>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage(index);
                  }}
                  className={`shrink-0 w-16 h-12 rounded overflow-hidden cursor-pointer transition-all border-2 ${
                    currentImage === index
                      ? "border-amber-500 opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </Stack>
      </div>

      {/* Lightbox Modal */}
      <Modal
        opened={lightboxOpen}
        onClose={closeLightbox}
        fullScreen
        withCloseButton={false}
        padding={0}
        lockScroll
        zIndex={9999}
        styles={{
          body: {
            height: "100vh",
            width: "100vw",
            padding: 0,
            overflow: "hidden",
          },
          content: {
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            overflow: "hidden",
          },
          inner: {
            padding: 0,
          },
        }}
      >
        <div
          className="fixed inset-0 flex flex-col"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <Text size="sm" c="white" className="font-medium">
              {currentImage + 1} / {images.length}
            </Text>
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="xl"
              onClick={closeLightbox}
              className="text-white hover:bg-white/10"
            >
              <IconX size={24} />
            </ActionIcon>
          </div>

          {/* Main Image Area */}
          <div className="flex-1 flex items-center justify-center relative min-h-0">
            {/* Previous Button */}
            {images.length > 1 && (
              <ActionIcon
                variant="filled"
                size={48}
                radius="xl"
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10"
                onClick={goToPrevImage}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <IconChevronLeft size={28} color="white" />
              </ActionIcon>
            )}

            {/* Image - Larger size */}
            <div className="px-20">
              <img
                src={images[currentImage]}
                alt={`Preview ${currentImage + 1}`}
                className="max-h-[80vh] max-w-[calc(100vw-200px)] object-contain"
                style={{ userSelect: "none" }}
                draggable={false}
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <ActionIcon
                variant="filled"
                size={48}
                radius="xl"
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
                onClick={goToNextImage}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <IconChevronRight size={28} color="white" />
              </ActionIcon>
            )}
          </div>

          {/* Thumbnails Footer */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 px-4 py-3 shrink-0">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-12 h-12 rounded overflow-hidden cursor-pointer transition-all border-2 ${
                    currentImage === index
                      ? "border-amber-500 opacity-100"
                      : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
