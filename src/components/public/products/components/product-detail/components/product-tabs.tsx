import {
  Paper,
  Title,
  Stack,
  Group,
  Text,
  Tabs,
  List,
  ThemeIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import {
  IconCircleCheck,
  IconFileText,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";
import "./product-tabs.css";

interface ProductTabsProps {
  description?: {
    overview?: string;
    details?: string;
    features?: string[];
    applications?: string[];
  } | null;
  technicalSpecs?: Record<string, string | undefined> | null;
  warrantyPolicy?: string | null;
}

export function ProductTabs({
  description,
  technicalSpecs,
  warrantyPolicy,
}: ProductTabsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const specLabels: Record<string, string> = {
    power: t("productDetail.specs.power", "Công suất"),
    origin: t("productDetail.specs.origin", "Xuất xứ"),
    voltage: t("productDetail.specs.voltage", "Điện áp"),
    warranty: t("productDetail.specs.warranty", "Bảo hành"),
    material: t("productDetail.specs.material", "Chất liệu"),
    standard: t("productDetail.specs.standard", "Tiêu chuẩn"),
    surface: t("productDetail.specs.surface", "Bề mặt"),
    tolerance: t("productDetail.specs.tolerance", "Dung sai"),
    dimensions: t("productDetail.specs.dimensions", "Kích thước"),
    weight: t("productDetail.specs.weight", "Trọng lượng"),
    loadCapacity: t("productDetail.specs.loadCapacity", "Tải trọng"),
    weldingType: t("productDetail.specs.weldingType", "Kiểu hàn"),
    surfaceFinish: t("productDetail.specs.surfaceFinish", "Bề mặt hoàn thiện"),
  };

  return (
    <Tabs
      defaultValue="description"
      className="mt-8 custom-product-tabs"
      variant="pills"
      color={isDark ? "orange.6" : "orange.7"}
    >
      <Tabs.List grow className="custom-tabs-list">
        <Tabs.Tab value="description" leftSection={<IconFileText size={16} />}>
          <span
            className={`tab-content font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            {t("productDetail.tabs.description", "Mô tả chi tiết")}
          </span>
        </Tabs.Tab>
        <Tabs.Tab value="specs" leftSection={<IconSettings size={16} />}>
          <span
            className={`tab-content font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            {t("productDetail.tabs.specs", "Thông số kỹ thuật")}
          </span>
        </Tabs.Tab>
        <Tabs.Tab value="warranty" leftSection={<IconShieldCheck size={16} />}>
          <span
            className={`tab-content font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            {t("productDetail.tabs.warranty", "Chính sách bảo hành")}
          </span>
        </Tabs.Tab>
      </Tabs.List>

      {/* Description Tab */}
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
            <Title order={3} c={isDark ? "white" : "dark"}>
              {t("productDetail.overview.title", "Chi tiết sản phẩm")}
            </Title>
            <Text
              c={isDark ? "gray.3" : "gray.7"}
              size="md"
              style={{ lineHeight: 1.7 }}
            >
              {description?.details ||
                description?.overview ||
                t(
                  "productDetail.overview.noInfo",
                  "Thông tin đang được cập nhật."
                )}
            </Text>
            {description?.features && description.features.length > 0 && (
              <div>
                <Title order={4} mb="md" c={isDark ? "white" : "dark"}>
                  {t("productDetail.features.title", "Đặc điểm nổi bật")}
                </Title>
                <List
                  spacing="sm"
                  icon={
                    <ThemeIcon color="green" size={24} radius="xl">
                      <IconCircleCheck size={16} />
                    </ThemeIcon>
                  }
                >
                  {description.features.map((feature, index) => (
                    <List.Item key={index}>
                      <Text c={isDark ? "gray.2" : "gray.8"}>{feature}</Text>
                    </List.Item>
                  ))}
                </List>
              </div>
            )}
          </Stack>
        </Paper>
      </Tabs.Panel>

      {/* Technical Specs Tab */}
      <Tabs.Panel value="specs" pt="md">
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
          <Title order={3} mb="lg" c={isDark ? "white" : "dark"}>
            {t("productDetail.technicalSpecs.title", "Thông số kỹ thuật")}
          </Title>
          {technicalSpecs && Object.keys(technicalSpecs).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(technicalSpecs).map(([key, value]) => {
                if (!value) return null;
                return (
                  <Paper
                    key={key}
                    p="md"
                    radius="md"
                    withBorder
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)",
                      borderColor: isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Group justify="space-between" align="center">
                      <Text c={isDark ? "gray.4" : "gray.6"} size="sm">
                        {specLabels[key] ||
                          key.charAt(0).toUpperCase() + key.slice(1)}
                        :
                      </Text>
                      <Text fw={600} c={isDark ? "white" : "dark"}>
                        {value}
                      </Text>
                    </Group>
                  </Paper>
                );
              })}
            </div>
          ) : (
            <Text c={isDark ? "gray.4" : "gray.6"}>
              {t(
                "productDetail.specs.noInfo",
                "Thông số kỹ thuật đang được cập nhật."
              )}
            </Text>
          )}
        </Paper>
      </Tabs.Panel>

      {/* Warranty Tab */}
      <Tabs.Panel value="warranty" pt="md">
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
            <Title order={3} c={isDark ? "white" : "dark"}>
              {t("productDetail.warranty.title", "Chính sách bảo hành")}
            </Title>
            <Text
              c={isDark ? "gray.3" : "gray.7"}
              size="md"
              style={{ lineHeight: 1.7 }}
            >
              {warrantyPolicy ||
                t(
                  "productDetail.warranty.noInfo",
                  "Thông tin bảo hành đang được cập nhật."
                )}
            </Text>
          </Stack>
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}
