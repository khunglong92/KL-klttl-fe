import { useState } from "react";
import { Paper, Badge, Stack, Group, Text, Title, Divider } from "@mantine/core";
import { IconShoppingCart, IconHeart, IconShare, IconPackage, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";
import AppButton from "@/components/atoms/app-button";

interface ProductInfoProps {
  product: {
    id?: string;
    name: string;
    category?: { name: string; id?: number };
    rating?: number;
    reviews?: number;
    price?: string | null;  // Changed from number to string to match Prisma schema
    unit?: string;
    description?: string;
    isFeatured?: boolean;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: string | null | undefined) => {
    if (!price || price === null || price === undefined) {
      return t("productDetail.price.contact", "Liên hệ");
    }
    // If price is already formatted as a string, return it directly
    // Otherwise, try to parse and format it
    const numericPrice = parseFloat(price.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericPrice)) {
      return price; // Return as-is if not a valid number
    }
    const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
    const currency = i18n.language === "vi" ? "VND" : "USD";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(numericPrice);
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || product.name,
          url: url,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        t(
          "productDetail.actions.shareSuccess",
          "Đã sao chép link vào clipboard!"
        )
      );
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      toast.error(
        t("productDetail.actions.shareError", "Không thể sao chép link")
      );
    }
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <div>
        {product.isFeatured && (
          <Badge 
            size="lg" 
            variant="gradient" 
            gradient={{ from: 'orange', to: 'red' }}
            mb="sm"
          >
            {t("productDetail.badge.featured", "Nổi bật")}
          </Badge>
        )}
        <Title order={1} mb="xs" c={isDark ? "white" : "dark"}>
          {product.name}
        </Title>
        {product.category && (
          <Text c={isDark ? "gray.4" : "gray.6"} size="md">
            {t("productDetail.category", "Danh mục")}: <Text span fw={500} c={isDark ? "orange.4" : "orange.7"}>{product.category.name}</Text>
          </Text>
        )}
      </div>

      {/* Rating */}
      {product.rating && product.reviews && (
        <Group gap="xs">
          <Group gap={4}>
            {[...Array(5)].map((_, i) => (
              i < Math.floor(product.rating || 0) ? (
                <IconStarFilled key={i} size={20} style={{ color: '#ffd43b' }} />
              ) : (
                <IconStar key={i} size={20} style={{ color: '#adb5bd' }} />
              )
            ))}
          </Group>
          <Text size="sm" c={isDark ? "gray.4" : "gray.6"}>
            {product.rating} ({product.reviews}{" "}
            {t("productDetail.reviews", "đánh giá")})
          </Text>
        </Group>
      )}

      <Divider />

      {/* Price - Redesigned without box */}
      <div>
        <Text size="sm" c={isDark ? "gray.5" : "gray.6"} mb={4}>
          {t("productDetail.price.label", "Giá")}
        </Text>
        <Group align="baseline" gap="xs">
          <Text 
            size="2.5rem" 
            fw={700} 
            c={isDark ? "orange.4" : "orange.7"}
            style={{ lineHeight: 1 }}
          >
            {formatPrice(product.price)}
          </Text>
          {product.unit && product.price && (
            <Text size="lg" c={isDark ? "gray.4" : "gray.6"}>
              / {product.unit}
            </Text>
          )}
        </Group>
      </div>

      <Divider />

      {/* Description */}
      {product.description && (
        <div>
          <Title order={4} mb="sm" c={isDark ? "white" : "dark"}>
            {t("productDetail.description", "Mô tả")}
          </Title>
          <Text c={isDark ? "gray.3" : "gray.7"} size="md" style={{ lineHeight: 1.6 }}>
            {product.description}
          </Text>
        </div>
      )}

      {/* Action Buttons */}
      <Stack gap="md" pt="md">
        <AppButton
          label={t("productDetail.actions.requestQuote", "Yêu cầu báo giá")}
          size="lg"
          leftSection={<IconShoppingCart size={20} />}
          showArrow={false}
        />
        <Group grow>
          <AppButton
            label={t("productDetail.actions.favorite", "Yêu thích")}
            size="lg"
            variant={isFavorite ? "outline" : "outline-primary"}
            onClick={() => setIsFavorite(!isFavorite)}
            leftSection={<IconHeart size={20} fill={isFavorite ? "currentColor" : "none"} />}
            showArrow={false}
          />
          <AppButton
            label={t("productDetail.actions.share", "Chia sẻ")}
            size="lg"
            variant="outline-primary"
            onClick={handleShare}
            leftSection={<IconShare size={20} />}
            showArrow={false}
          />
        </Group>
      </Stack>

      {/* Additional Info */}
      <Paper 
        p="lg" 
        radius="md" 
        withBorder
        style={{
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Group align="flex-start" gap="md">
          <IconPackage size={24} style={{ color: isDark ? '#ffa94d' : '#fd7e14', marginTop: 2 }} />
          <div>
            <Text fw={600} mb={4} c={isDark ? "white" : "dark"}>
              {t("productDetail.delivery.title", "Giao hàng toàn quốc")}
            </Text>
            <Text size="sm" c={isDark ? "gray.4" : "gray.6"}>
              {t(
                "productDetail.delivery.description",
                "Miễn phí vận chuyển cho đơn hàng trên 10 tấn"
              )}
            </Text>
          </div>
        </Group>
      </Paper>
    </Stack>
  );
}
