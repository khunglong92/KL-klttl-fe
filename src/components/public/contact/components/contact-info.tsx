import {
  Paper,
  Text,
  Title,
  Stack,
  Group,
  ThemeIcon,
  ActionIcon,
  Box,
  Skeleton,
} from "@mantine/core";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
} from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useEffect } from "react";
import { ZaloIcon } from "@/components/atoms/zalo-icon";
import Ultils from "@/utils";
import { useTranslation } from "react-i18next";

export function ContactInfo() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { data, isLoading } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (data) {
      setCompanyInfo(data);
    }
  }, [data, setCompanyInfo]);

  const contactDetails = [
    {
      icon: IconMapPin,
      title: t("contactInfo.details.address"),
      content: companyInfo?.address || import.meta.env["VITE_COMPANY_ADDRESS"],
    },
    {
      icon: IconPhone,
      title: t("contactInfo.details.phone"),
      content: companyInfo?.phone || import.meta.env["VITE_ZALO_PHONE_NUMBER"],
      link: `tel:${companyInfo?.phone}`,
    },
    {
      icon: IconMail,
      title: t("contactInfo.details.email"),
      content: companyInfo?.email || import.meta.env["VITE_EMAIL_CONTACT"],
      link: `mailto:${companyInfo?.email}`,
    },
    {
      icon: IconClock,
      title: t("contactInfo.details.workingHours"),
      content:
        companyInfo?.workingHours ||
        import.meta.env["VITE_COMPANY_WORKING_HOURS"],
    },
  ];

  const contactMethods = [
    {
      icon: IconPhone,
      label: "Phone",
      href: `tel:${companyInfo?.phone}`,
    },
    {
      icon: ZaloIcon,
      label: "Zalo",
      href: `https://zalo.me/${companyInfo?.phone}`,
    },
  ].filter(() => companyInfo?.phone);

  if (isLoading) {
    return (
      <Stack gap="xl">
        <Skeleton height={250} radius="md" />
        <Skeleton height={150} radius="md" />
        <Skeleton height={250} radius="md" />
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      {/* Contact Details */}
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        bg={theme === "dark" ? "dark.7" : "white"}
      >
        <Title order={3} mb="lg">
          {t("contactInfo.title")}
        </Title>
        <Stack gap="lg">
          {contactDetails.map((detail) => {
            if (!detail.content) return null;
            const Icon = detail.icon;
            return (
              <Group key={detail.title} wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" size="lg" radius="md">
                  <Icon size={20} />
                </ThemeIcon>
                <Box flex={1}>
                  <Text fw={500}>{detail.title}</Text>
                  <Text c="dimmed" size="sm" style={{ whiteSpace: "pre-line" }}>
                    {detail.link ? (
                      <a href={detail.link} className="hover:underline">
                        {detail.content}
                      </a>
                    ) : (
                      detail.content
                    )}
                  </Text>
                </Box>
              </Group>
            );
          })}
        </Stack>
      </Paper>

      {/* Social Media */}
      {contactMethods?.length > 0 && (
        <Paper
          shadow="md"
          p="xl"
          radius="md"
          withBorder
          bg={theme === "dark" ? "dark.7" : "white"}
        >
          <Title order={3} mb="lg">
            {t("contactInfo.connectTitle")}
          </Title>
          <Group gap="md">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <ActionIcon
                  key={method.label}
                  component="a"
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="light"
                  size="lg"
                  radius="md"
                  aria-label={method.label}
                >
                  <Icon size={20} />
                </ActionIcon>
              );
            })}
          </Group>
        </Paper>
      )}

      {/* Map Placeholder */}
      {companyInfo?.googleMapUrl && (
        <Paper
          shadow="md"
          radius="md"
          withBorder
          bg={theme === "dark" ? "dark.6" : "white"}
          className="p-4"
        >
          <Title order={3} mb="lg">
            {t("contactInfo.locationTitle")}
          </Title>
          <Box
            h={200}
            style={{
              overflow: "hidden",
              borderRadius: "var(--mantine-radius-md)",
            }}
          >
            <iframe
              src={Ultils.extractSrcFromIframe(companyInfo.googleMapUrl)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>
        </Paper>
      )}
    </Stack>
  );
}
