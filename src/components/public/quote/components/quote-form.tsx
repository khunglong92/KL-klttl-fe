import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Textarea,
  Select,
  Group,
  Stack,
  Paper,
  Title,
  Text,
  FileButton,
  Button,
  Alert,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconBriefcase,
  IconFileText,
  IconCalendar,
  IconSend,
  IconUpload,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { useQuote, QuoteFormData } from "../hooks/use-quote";
import AppButton from "@/components/atoms/app-button";
import { FileUploadPreview } from "./file-upload-preview";

// Regex for Vietnamese phone number validation
const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/;

// Function to format phone number as "0xxx xxx xxx"
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength === 0) return "";
  if (phoneNumberLength <= 4) return phoneNumber;
  if (phoneNumberLength <= 7) {
    return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
  }
  return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 10)}`;
};

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/acad", // DWG
  "image/vnd.dxf", // DXF
];

export function QuoteForm() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { createQuote, isSubmitting, uploadProgress, uploadStatus } =
    useQuote();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const form = useForm<QuoteFormData>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      title: "",
      projectName: "",
      projectType: "",
      projectDescription: "",
      budget: "",
      expectedCompletion: "",
      technicalRequirements: "",
      content: "",
      subject: "quote",
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0 ? null : t("quoteForm.validation.nameRequired"),
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : t("quoteForm.validation.emailInvalid"),
      phone: (value: string) => {
        if (!value) return t("quoteForm.validation.phoneRequired");
        if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          return t("quoteForm.validation.phoneInvalid");
        }
        return null;
      },
      projectName: (value: string) =>
        value.trim().length > 0
          ? null
          : t("quoteForm.validation.projectNameRequired"),
      projectType: (value: string) =>
        value.trim().length > 0
          ? null
          : t("quoteForm.validation.projectTypeRequired"),
      projectDescription: (value: string) =>
        value.trim().length > 0
          ? null
          : t("quoteForm.validation.projectDescriptionRequired"),
      content: (value: string) =>
        value.trim().length > 0
          ? null
          : t("quoteForm.validation.messageRequired"),
    },
  });

  // Handle file selection with validation
  const handleFileSelect = (selectedFile: File | null) => {
    setFileError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(
        `File quá lớn. Kích thước tối đa là ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
      return;
    }

    // Check file type using MIME types for better accuracy
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setFileError(
        `Loại file không được hỗ trợ. Vui lòng chọn một trong các định dạng được chấp nhận.`
      );
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError("");
  };

  const handleSubmit = (values: typeof form.values) => {
    // Check if file has error
    if (fileError) {
      return;
    }

    const submissionValues = {
      ...values,
      phone: values.phone.replace(/\s/g, ""),
      file: file,
    };

    createQuote(submissionValues, {
      onSuccess: () => {
        form.reset();
        setFile(null);
        setFileError("");
      },
    });
  };

  const projectTypes = [
    { value: "mechanical", label: t("quoteForm.projectTypes.mechanical") },
    { value: "electrical", label: t("quoteForm.projectTypes.electrical") },
    { value: "construction", label: t("quoteForm.projectTypes.construction") },
    {
      value: "transportation",
      label: t("quoteForm.projectTypes.transportation"),
    },
    { value: "custom", label: t("quoteForm.projectTypes.custom") },
    { value: "other", label: t("quoteForm.projectTypes.other") },
  ];

  const budgetRanges = [
    { value: "under-50m", label: t("quoteForm.budgetRanges.under50m") },
    { value: "50m-100m", label: t("quoteForm.budgetRanges.50m100m") },
    { value: "100m-500m", label: t("quoteForm.budgetRanges.100m500m") },
    { value: "500m-1b", label: t("quoteForm.budgetRanges.500m1b") },
    { value: "over-1b", label: t("quoteForm.budgetRanges.over1b") },
    { value: "discuss", label: t("quoteForm.budgetRanges.discuss") },
  ];

  return (
    <Paper
      shadow="xl"
      p="xl"
      radius="lg"
      withBorder
      bg={theme === "dark" ? "dark.7" : "white"}
      className="relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs" className="relative z-10">
            {t("quoteForm.title")}
          </Title>
          <Text c="dimmed" size="sm" className="relative z-10">
            {t("quoteForm.subtitle")}
          </Text>
        </div>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* Customer Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <IconUser className="w-5 h-5 text-amber-500" />
              </div>
              <Title order={4}>{t("quoteForm.sections.customerInfo")}</Title>
            </div>

            <Stack gap="md">
              <Group grow>
                <TextInput
                  label={t("quoteForm.labels.name")}
                  placeholder={t("quoteForm.placeholders.name")}
                  withAsterisk
                  leftSection={<IconUser size={18} />}
                  {...form.getInputProps("name")}
                />
                <TextInput
                  label={t("quoteForm.labels.email")}
                  placeholder="example@email.com"
                  withAsterisk
                  leftSection={<IconMail size={18} />}
                  {...form.getInputProps("email")}
                />
              </Group>

              <Group grow>
                <TextInput
                  label={t("quoteForm.labels.phone")}
                  placeholder="0123 456 789"
                  withAsterisk
                  leftSection={<IconPhone size={18} />}
                  {...form.getInputProps("phone")}
                  onChange={(event) => {
                    const formatted = formatPhoneNumber(
                      event.currentTarget.value
                    );
                    form.setFieldValue("phone", formatted);
                  }}
                />
                <TextInput
                  label={t("quoteForm.labels.company")}
                  placeholder={t("quoteForm.placeholders.company")}
                  leftSection={<IconBuilding size={18} />}
                  {...form.getInputProps("company")}
                />
              </Group>

              <Group grow>
                <TextInput
                  label={t("quoteForm.labels.title")}
                  placeholder={t("quoteForm.placeholders.title")}
                  leftSection={<IconBriefcase size={18} />}
                  {...form.getInputProps("title")}
                />
                <TextInput
                  label={t("quoteForm.labels.address")}
                  placeholder={t("quoteForm.placeholders.address")}
                  leftSection={<IconMapPin size={18} />}
                  {...form.getInputProps("address")}
                />
              </Group>
            </Stack>
          </div>

          {/* Project Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <IconFileText className="w-5 h-5 text-blue-500" />
              </div>
              <Title order={4}>{t("quoteForm.sections.projectInfo")}</Title>
            </div>

            <Stack gap="md">
              <TextInput
                label={t("quoteForm.labels.projectName")}
                placeholder={t("quoteForm.placeholders.projectName")}
                withAsterisk
                {...form.getInputProps("projectName")}
              />

              <Group grow>
                <Select
                  label={t("quoteForm.labels.projectType")}
                  placeholder={t("quoteForm.placeholders.projectType")}
                  withAsterisk
                  data={projectTypes}
                  {...form.getInputProps("projectType")}
                />
                <Select
                  label={t("quoteForm.labels.budget")}
                  placeholder={t("quoteForm.placeholders.budget")}
                  data={budgetRanges}
                  {...form.getInputProps("budget")}
                />
              </Group>

              <Textarea
                label={t("quoteForm.labels.projectDescription")}
                placeholder={t("quoteForm.placeholders.projectDescription")}
                withAsterisk
                minRows={4}
                {...form.getInputProps("projectDescription")}
              />

              <TextInput
                label={t("quoteForm.labels.expectedCompletion")}
                placeholder={t("quoteForm.placeholders.expectedCompletion")}
                leftSection={<IconCalendar size={18} />}
                {...form.getInputProps("expectedCompletion")}
              />
            </Stack>
          </div>

          {/* Technical Requirements Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <IconFileText className="w-5 h-5 text-green-500" />
              </div>
              <Title order={4}>
                {t("quoteForm.sections.technicalRequirements")}
              </Title>
            </div>

            <Stack gap="md">
              <Textarea
                label={t("quoteForm.labels.technicalRequirements")}
                placeholder={t("quoteForm.placeholders.technicalRequirements")}
                minRows={3}
                {...form.getInputProps("technicalRequirements")}
              />

              {/* File Upload Section */}
              <div>
                <Text size="sm" fw={500} mb={8}>
                  {t("quoteForm.labels.attachments")}
                </Text>

                {!file ? (
                  <>
                    <FileButton
                      onChange={handleFileSelect}
                      accept={ALLOWED_FILE_TYPES.join(",")}
                    >
                      {(props) => (
                        <Button
                          {...props}
                          variant="light"
                          leftSection={<IconUpload size={18} />}
                          fullWidth
                        >
                          {t("quoteForm.placeholders.attachments")}
                        </Button>
                      )}
                    </FileButton>

                    <Text size="xs" c="dimmed" mt={8}>
                      {t("quoteForm.attachmentsDescription")} (Tối đa 10MB)
                    </Text>

                    <Text size="xs" c="dimmed" mt={4}>
                      Định dạng: PDF, Word, Excel, Hình ảnh, ZIP, DWG, DXF
                    </Text>
                  </>
                ) : (
                  <FileUploadPreview
                    file={file}
                    uploadProgress={uploadProgress}
                    uploadStatus={uploadStatus}
                    onRemove={handleRemoveFile}
                    error={fileError}
                  />
                )}

                {fileError && !file && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    mt="sm"
                  >
                    {fileError}
                  </Alert>
                )}
              </div>
            </Stack>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <Textarea
              label={t("quoteForm.labels.additionalInfo")}
              placeholder={t("quoteForm.placeholders.additionalInfo")}
              withAsterisk
              minRows={4}
              {...form.getInputProps("content")}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <AppButton
              htmlType="submit"
              size="lg"
              loading={isSubmitting}
              leftSection={<IconSend size={18} />}
              label={t("quoteForm.submitButton")}
              showArrow={false}
            />
          </div>
        </form>
      </Stack>
    </Paper>
  );
}
