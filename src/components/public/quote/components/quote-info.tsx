import {
  Paper,
  Text,
  Title,
  Stack,
  Group,
  ThemeIcon,
  Box,
  Skeleton,
  rem,
} from "@mantine/core";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconCheck,
  IconAward,
  IconUsers,
  IconTrendingUp,
  IconFileText,
  IconBulb,
  IconFileDollar,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function QuoteInfo() {
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
      content: companyInfo?.address,
    },
    {
      icon: IconPhone,
      title: t("contactInfo.details.phone"),
      content: companyInfo?.phone,
      link: `tel:${companyInfo?.phone}`,
    },
    {
      icon: IconMail,
      title: t("contactInfo.details.email"),
      content: companyInfo?.email,
      link: `mailto:${companyInfo?.email}`,
    },
    {
      icon: IconClock,
      title: t("contactInfo.details.workingHours"),
      content: companyInfo?.workingHours,
    },
  ].filter((detail) => detail.content);

  const benefits = [
    {
      icon: IconAward,
      title: t("quoteInfo.benefits.quality.title"),
      description: t("quoteInfo.benefits.quality.description"),
    },
    {
      icon: IconCheck,
      title: t("quoteInfo.benefits.experience.title"),
      description: t("quoteInfo.benefits.experience.description"),
    },
    {
      icon: IconUsers,
      title: t("quoteInfo.benefits.support.title"),
      description: t("quoteInfo.benefits.support.description"),
    },
    {
      icon: IconTrendingUp,
      title: t("quoteInfo.benefits.competitive.title"),
      description: t("quoteInfo.benefits.competitive.description"),
    },
  ];

  const processSteps = [
    {
      icon: IconFileText,
      title: t("quoteInfo.process.step1"),
      description: t("quoteInfo.process.step1_desc"),
    },
    {
      icon: IconBulb,
      title: t("quoteInfo.process.step2"),
      description: t("quoteInfo.process.step2_desc"),
    },
    {
      icon: IconFileDollar,
      title: t("quoteInfo.process.step3"),
      description: t("quoteInfo.process.step3_desc"),
    },
    {
      icon: IconPlayerPlay,
      title: t("quoteInfo.process.step4"),
      description: t("quoteInfo.process.step4_desc"),
    },
  ];

  if (isLoading) {
    return (
      <Stack gap="xl">
        <Skeleton height={250} radius="md" />
        <Skeleton height={200} radius="md" />
        <Skeleton height={300} radius="md" />
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
          {t("quoteInfo.contactTitle")}
        </Title>
        <Stack gap="lg">
          {contactDetails.map((detail) => {
            const Icon = detail.icon;
            return (
              <Group key={detail.title} wrap="nowrap" align="flex-start">
                <ThemeIcon variant="light" size="lg" radius="md" color="amber">
                  <Icon size={20} />
                </ThemeIcon>
                <Box flex={1}>
                  <Text fw={500}>{detail.title}</Text>
                  <Text c="dimmed" size="sm" style={{ whiteSpace: "pre-line" }}>
                    {detail.link ? (
                      <a
                        href={detail.link}
                        className="hover:underline text-amber-600 dark:text-amber-400"
                      >
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

      {/* Benefits */}
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        bg={theme === "dark" ? "dark.7" : "white"}
      >
        <Title order={3} mb="lg">
          {t("quoteInfo.benefitsTitle")}
        </Title>
        <Stack gap="md">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Group wrap="nowrap" align="flex-start" gap="md">
                  <ThemeIcon
                    variant="light"
                    size="md"
                    radius="md"
                    color="amber"
                  >
                    <Icon size={18} />
                  </ThemeIcon>
                  <Box flex={1}>
                    <Text fw={600} size="sm" mb={4}>
                      {benefit.title}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {benefit.description}
                    </Text>
                  </Box>
                </Group>
              </motion.div>
            );
          })}
        </Stack>
      </Paper>

      {/* Process Info */}
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        bg={theme === "dark" ? "dark.7" : "white"}
      >
        <Title order={3} mb="xl">
          {t("quoteInfo.processTitle")}
        </Title>
        <div className="relative pl-8">
          <Stack gap="xl">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className="relative flex gap-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="absolute left-[-34px] top-1/2 -translate-y-1/2">
                    <ThemeIcon
                      size="lg"
                      radius="xl"
                      color="amber"
                      variant="light"
                      className="border-4 border-background"
                    >
                      <Icon style={{ width: rem(20), height: rem(20) }} />
                    </ThemeIcon>
                  </div>
                  <div className="flex flex-col gap-y-2 ml-4">
                    <Text size="sm" fw={500}>
                      {step.title}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {step.description}
                    </Text>
                  </div>
                </motion.div>
              );
            })}
          </Stack>
        </div>
      </Paper>
    </Stack>
  );
}
