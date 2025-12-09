import { Box, Title, Text, Paper, Group } from "@mantine/core";
import AppButton from "@/components/atoms/app-button";
import { useTheme } from "@/hooks/useTheme";

interface ServiceCTAProps {
  ctaLabel: string;
  ctaLink: string;
  title: string;
}

export function ServiceCTA({ ctaLabel, ctaLink, title }: ServiceCTAProps) {
  const { theme } = useTheme();
  const gradient =
    theme === "dark"
      ? "linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-gray-8) 100%)"
      : "linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-purple-0) 100%)";

  return (
    <Paper withBorder p="xl" radius="md" style={{ background: gradient }}>
      <Group justify="space-between" align="center">
        <Box maw={600}>
          <Title order={3}>Bắt đầu với {title}</Title>
          <Text mt="sm" c="dimmed">
            Sẵn sàng để đưa doanh nghiệp của bạn lên một tầm cao mới? Liên hệ
            với chúng tôi ngay hôm nay để được tư vấn chi tiết.
          </Text>
        </Box>
        <AppButton
          variant="default"
          size="lg"
          onClick={() => (window.location.href = ctaLink)}
          label={ctaLabel}
        />
      </Group>
    </Paper>
  );
}
