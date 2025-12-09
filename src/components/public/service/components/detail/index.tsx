import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import {
  servicesService,
  CompanyService,
} from "@/services/api/servicesService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ServiceHero } from "./services-hero";
import { ServiceFeatures } from "./services-features";
import { ServiceTechnologies } from "./services-technogories";
import { ServiceBenefits } from "./servoces-benefits";
import { ServiceContent } from "./services-content";
import { ServiceCTA } from "./services-cta";
import {
  Text,
  Paper,
  Stack,
  Loader,
  Title,
  Box,
  Container,
} from "@mantine/core";
import { useTheme } from "@/hooks/useTheme";

export default function ServiceDetailComponent() {
  const { id } = useParams({ from: "/services/$id" });
  const { t } = useTranslation();
  const [service, setService] = useState<CompanyService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(new Error("Service ID is missing."));
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesService.findOne(id);
        setService(response);
      } catch (err) {
        const fetchError =
          err instanceof Error
            ? err
            : new Error("Failed to load service details.");
        setError(fetchError);
        toast.error(t("serviceDetail.toast.loadError"));
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchService();
  }, [id, t]);

  if (loading) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Loader size="xl" />
        <Text>Loading service details...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Paper p="xl" withBorder shadow="md">
          <Title order={3} c="red">
            Error
          </Title>
          <Text>{error.message || "Failed to load service details."}</Text>
        </Paper>
      </Stack>
    );
  }

  if (!service) {
    return (
      <Stack align="center" justify="center" style={{ height: "80vh" }}>
        <Text>Service not found.</Text>
      </Stack>
    );
  }

  return (
    <Box bg={theme === "dark" ? "dark.8" : "gray.0"}>
      <ServiceHero
        title={service.title}
        subtitle={service.subtitle}
        shortDescription={service.shortDescription}
        imageUrls={service.imageUrls || []}
        tags={service.tags}
        ctaLabel={service.ctaLabel}
        ctaLink={service.ctaLink}
        isFeatured={service.isFeatured}
      />

      <Container size="lg" mt="-xl" pos="relative" style={{ zIndex: 1 }}>
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Stack gap="xl">
            {service.content && (
              <ServiceContent
                content={service.content}
                imageUrls={service.imageUrls || []}
                title={service.title}
              />
            )}

            {service.features && (
              <ServiceFeatures features={service.features} />
            )}

            {service.technologies && (
              <ServiceTechnologies technologies={service.technologies} />
            )}

            {service.benefits && (
              <ServiceBenefits benefits={service.benefits} />
            )}
          </Stack>
        </Paper>
      </Container>

      <Container size="lg" mt="xl" pb="xl">
        <ServiceCTA
          ctaLabel={service.ctaLabel}
          ctaLink={service.ctaLink}
          title={service.title}
        />
      </Container>
    </Box>
  );
}
