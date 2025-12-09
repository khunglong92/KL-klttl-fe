import { Box, Title, Grid, Card, Text, ThemeIcon } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";

export function ServiceFeatures({ features }: { features: string | string[] }) {
  const { theme } = useTheme();
  const featureList = (() => {
    if (!features) return [];

    if (Array.isArray(features)) {
      return features.filter((f) => f.trim());
    }

    if (typeof features === "string") {
      const isHtmlContent = features.includes("<");
      if (isHtmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(features, "text/html");
        return Array.from(doc.querySelectorAll("li")).map(
          (li) => li.textContent || ""
        );
      }
      return features.split("\n").filter((f) => f.trim());
    }

    return [];
  })();

  if (featureList.length === 0) {
    return null;
  }

  return (
    <Box>
      <Title order={2} ta="center" mb="xl">
        Tính năng nổi bật
      </Title>
      <Grid gutter="xl">
        {featureList.map((feature, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
              h="100%"
              bg={theme === "dark" ? "dark.7" : "white"}
            >
              <ThemeIcon
                variant="gradient"
                gradient={{ from: "blue", to: "purple" }}
                size="lg"
                mb="md"
              >
                <IconCheck size={20} />
              </ThemeIcon>
              <Text>{feature}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
