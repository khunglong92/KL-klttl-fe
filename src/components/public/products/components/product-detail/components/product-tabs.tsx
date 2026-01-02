import {
  Paper,
  Title,
  Stack,
  Text,
  Tabs,
  List,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import {
  IconCircleCheck,
  IconFileText,
  IconArticle,
} from "@tabler/icons-react";
import "./product-tabs.css";

interface ProductTabsProps {
  description?: string[] | null;
  detailedDescription?: string | null;
}

export function ProductTabs({
  description,
  detailedDescription,
}: ProductTabsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "white" : "black";

  return (
    <Tabs
      defaultValue="description"
      className="mt-8 custom-product-tabs"
      variant="pills"
      color={isDark ? "orange.6" : "orange.7"}
    >
      <Tabs.List grow className="custom-tabs-list">
        <Tabs.Tab value="description" leftSection={<IconFileText size={18} />}>
          <span
            className={`tab-content font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            {t("productDetail.tabs.description", "Thông tin chung")}
          </span>
        </Tabs.Tab>
        <Tabs.Tab value="detailed" leftSection={<IconArticle size={18} />}>
          <span
            className={`tab-content font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            {t("productDetail.tabs.detailed", "Mô tả chi tiết")}
          </span>
        </Tabs.Tab>
      </Tabs.List>

      {/* General Description Tab */}
      <Tabs.Panel value="description" pt="md">
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          withBorder
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.3)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack gap="lg">
            <Title order={3} c={textColor}>
              {t("productDetail.overview.title", "Đặc điểm sản phẩm")}
            </Title>
            {description && description.length > 0 ? (
              <List
                spacing="md"
                icon={
                  <ThemeIcon color="orange" size={24} radius="xl">
                    <IconCircleCheck size={16} />
                  </ThemeIcon>
                }
              >
                {description.map((line, index) => (
                  <List.Item key={index}>
                    <Text size="lg" c={isDark ? "gray.2" : "gray.8"}>
                      {line}
                    </Text>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Text c="dimmed">
                {t(
                  "productDetail.overview.noInfo",
                  "Thông tin đang được cập nhật."
                )}
              </Text>
            )}
          </Stack>
        </Paper>
      </Tabs.Panel>

      {/* Detailed Content Tab */}
      <Tabs.Panel value="detailed" pt="md">
        <Paper
          shadow="sm"
          p="xl"
          radius="md"
          withBorder
          style={{
            backgroundColor: isDark
              ? "rgba(0, 0, 0, 0.3)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        >
          <Stack gap="lg">
            <Title order={3} c={textColor}>
              {t("productDetail.detailed.title", "Bài viết chi tiết")}
            </Title>
            {detailedDescription ? (
              <Box
                className="detailed-description-content"
                style={{
                  color: isDark
                    ? "var(--mantine-color-gray-3)"
                    : "var(--mantine-color-gray-8)",
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                }}
                dangerouslySetInnerHTML={{ __html: detailedDescription }}
              />
            ) : (
              <Text c="dimmed">
                {t(
                  "productDetail.detailed.noInfo",
                  "Mô tả chi tiết đang được cập nhật."
                )}
              </Text>
            )}
          </Stack>
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}
