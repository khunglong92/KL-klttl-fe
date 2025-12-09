import {
  Box,
  Container,
  Title,
  Text,
  Grid,
  Badge,
  Stack,
  Group,
} from "@mantine/core";
import { AppThumbnailImage } from "../../../common/app-thumbnail-image";
import AppButton from "@/components/atoms/app-button";
import { useTheme } from "@/hooks/useTheme";

export function ServiceHero({
  title,
  subtitle,
  shortDescription,
  imageUrls,
  tags,
  ctaLabel,
  ctaLink,
  isFeatured,
}: {
  title: string;
  subtitle?: string;
  shortDescription: string;
  imageUrls: string[];
  tags: string[];
  ctaLabel: string;
  ctaLink: string;
  isFeatured: boolean;
}) {
  const { theme } = useTheme();
  return (
    <Box
      bg={theme === "dark" ? "dark.9" : "gray.1"}
      className="relative overflow-hidden"
    >
      <Container size="lg" py="xl">
        <Grid gutter={{ base: "xl", md: 50 }} align="center">
          {/* Left Content */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              {isFeatured && (
                <Badge
                  variant="gradient"
                  gradient={{ from: "blue", to: "purple" }}
                  size="lg"
                >
                  Dịch vụ nổi bật
                </Badge>
              )}

              <Title order={1} fz={{ base: 32, md: 48 }}>
                {title}
              </Title>

              {subtitle && (
                <Text fz="xl" c={theme === "dark" ? "blue.4" : "blue.6"}>
                  {subtitle}
                </Text>
              )}

              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: shortDescription || "",
                }}
              />

              {tags && tags.length > 0 && (
                <Group gap="xs">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              )}

              <Box mt="md">
                <AppButton
                  variant="default"
                  onClick={() => (window.location.href = ctaLink)}
                  label={ctaLabel}
                />
              </Box>
            </Stack>
          </Grid.Col>

          {/* Right Image */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <AppThumbnailImage
              src={imageUrls[0] || ""}
              alt={title}
              className="shadow-xl w-full h-auto max-h-[500px] object-cover"
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
