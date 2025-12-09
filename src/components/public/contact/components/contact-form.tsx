import {
  Paper,
  TextInput,
  Textarea,
  Select,
  Group,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSend } from "@tabler/icons-react";
import AppButton from "@/components/atoms/app-button";
import { useTheme } from "@/hooks/useTheme";
import { useCreateContact } from "@/services/hooks/useContacts";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

// Regex for Vietnamese phone number validation (10 digits starting with 0)
const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;

// Function to format phone number as "0xxx xxx xxx"
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  // Remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength === 0) return "";

  // Apply formatting: 0xxx xxx xxx
  if (phoneNumberLength <= 4) {
    return phoneNumber;
  }
  if (phoneNumberLength <= 7) {
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
  }
  return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 10)}`;
};

export function ContactForm() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { mutate: createContact, isPending } = useCreateContact();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      title: "",
      address: "",
      subject: "",
      content: "",
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0
          ? null
          : t("contactForm.validation.nameRequired"),
      email: (value: string) =>
        /^\S+@\S+$/.test(value)
          ? null
          : t("contactForm.validation.emailInvalid"),
      content: (value: string) =>
        value.trim().length > 0
          ? null
          : t("contactForm.validation.messageRequired"),
      title: (value: string) =>
        value.trim().length > 0
          ? null
          : t("contactForm.validation.titleRequired"),
      phone: (value: string) => {
        if (value && !phoneRegex.test(value.replace(/\s/g, ""))) {
          return t("contactForm.validation.phoneInvalid");
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    // Remove spaces from phone number before submitting
    const submissionValues = {
      ...values,
      phone: values.phone.replace(/\s/g, ""),
    };
    createContact(submissionValues, {
      onSuccess: () => {
        form.reset();
        notifications.show({
          title: t("contactForm.success"),
          message: t("contactForm.successMessage"),
          color: "green",
        });
      },
      onError: () => {
        notifications.show({
          title: t("contactForm.error"),
          message: t("contactForm.errorMessage"),
          color: "red",
        });
      },
    });
  };

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      withBorder
      bg={theme === "dark" ? "dark.7" : "white"}
    >
      <Title order={2} mb="xs">
        {t("contactForm.title")}
      </Title>
      <Text c="dimmed" mb="xl">
        {t("contactForm.subtitle")}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group grow mb="md">
          <TextInput
            label={t("contactForm.labels.name")}
            placeholder={t("contactForm.placeholders.name")}
            withAsterisk
            {...form.getInputProps("name")}
          />
          <TextInput
            label={t("contactForm.labels.email")}
            placeholder="example@email.com"
            withAsterisk
            {...form.getInputProps("email")}
          />
        </Group>

        <Group grow mb="md">
          <TextInput
            label={t("contactForm.labels.title")}
            placeholder={t("contactForm.placeholders.title")}
            {...form.getInputProps("title")}
          />
        </Group>

        <Group grow mb="md">
          <TextInput
            label={t("contactForm.labels.address")}
            placeholder={t("contactForm.placeholders.address")}
            {...form.getInputProps("address")}
          />
        </Group>

        <Group grow mb="md">
          <TextInput
            label={t("contactForm.labels.phone")}
            placeholder="0123 456 789"
            {...form.getInputProps("phone")}
            onChange={(event) => {
              const formatted = formatPhoneNumber(event.currentTarget.value);
              form.setFieldValue("phone", formatted);
            }}
          />
          <Select
            label={t("contactForm.labels.subject")}
            placeholder={t("contactForm.placeholders.subject")}
            data={[
              { value: "general", label: t("contactForm.subjects.general") },
              { value: "support", label: t("contactForm.subjects.support") },
              { value: "sales", label: t("contactForm.subjects.sales") },
              {
                value: "partnership",
                label: t("contactForm.subjects.partnership"),
              },
              { value: "feedback", label: t("contactForm.subjects.feedback") },
              { value: "other", label: t("contactForm.subjects.other") },
            ]}
            {...form.getInputProps("subject")}
          />
        </Group>

        <Textarea
          label={t("contactForm.labels.message")}
          placeholder={t("contactForm.placeholders.message")}
          withAsterisk
          minRows={4}
          mb="xl"
          {...form.getInputProps("content")}
        />

        <AppButton
          htmlType="submit"
          size="lg"
          loading={isPending}
          leftSection={<IconSend size={18} />}
          label={t("contactForm.submitButton")}
        />
      </form>
    </Paper>
  );
}
