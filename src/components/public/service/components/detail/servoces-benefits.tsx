import { Box, Title, Text, SimpleGrid, Paper, ThemeIcon } from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";
import {
  IconTrendingUp,
  IconTargetArrow,
  IconZip,
  IconShieldCheck,
} from "@tabler/icons-react";

interface ServiceBenefitsProps {
  benefits: string | string[];
}

const iconMap = [IconTrendingUp, IconTargetArrow, IconZip, IconShieldCheck];

export function ServiceBenefits({ benefits }: ServiceBenefitsProps) {
  const { theme } = useTheme();
  const benefitList = (() => {
    if (!benefits) return [];

    if (Array.isArray(benefits)) {
      return benefits.filter((b) => b.trim());
    }

    if (typeof benefits === "string") {
      const isHtmlContent = benefits.includes("<");
      if (isHtmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(benefits, "text/html");
        return Array.from(doc.querySelectorAll("li")).map(
          (li) => li.textContent || ""
        );
      }
      return benefits.split("\n").filter((b) => b.trim());
    }

    return [];
  })();

  if (benefitList.length === 0) {
    return null;
  }

  return (
    <Box>
      <Title order={2} ta="center" mb="xl">
        Lợi ích mang lại
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
        {benefitList.map((benefit, index) => {
          const Icon = iconMap[index % iconMap.length];
          if (!Icon) return null;
          return (
            <Paper key={index} withBorder p="lg" radius="md" bg={theme === 'dark' ? 'dark.7' : 'white'}>
              <ThemeIcon
                variant="gradient"
                gradient={{ from: "blue", to: "purple" }}
                size="xl"
                radius="md"
                mb="md"
              >
                <Icon size={28} />
              </ThemeIcon>
              <Text>{benefit}</Text>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
