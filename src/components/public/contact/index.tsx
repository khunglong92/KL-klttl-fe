import { Box, Container, Grid, Title, Text, Badge, Stack } from "@mantine/core";
import { ContactForm } from "./components/contact-form";
import { ContactInfo } from "./components/contact-info";
import { useTheme } from "@/hooks/useTheme";
import { IconHeadset } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Box bg={theme === "dark" ? "dark.8" : "gray.0"} py="xl">
      <Container size="lg">
        <Stack align="center" mb="xl">
          <Badge
            variant="light"
            size="lg"
            leftSection={<IconHeadset size={16} />}
          >
            {t("contactPage.hero.badge")}
          </Badge>
          <Title order={1} ta="center">
            {t("contactPage.hero.title")}
          </Title>
          <Text c="dimmed" ta="center" maw={600}>
            {t("contactPage.hero.subtitle")}
          </Text>
        </Stack>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <ContactForm />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <ContactInfo />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
