import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContactInfoCrud } from "./hooks/use-contact-info-crud";
import { Card, Skeleton, Stack, Group } from "@mantine/core";
import AppButton from "@/components/atoms/app-button";
import { useTranslation } from "react-i18next";
import { ContactFormValues, getContactSchema } from "./schema";
import { GeneralInfoForm } from "./components/GeneralInfoForm";
import { StatisticsInfoForm } from "./components/StatisticsInfoForm";
import { AboutAndResourcesForm } from "./components/AboutAndResourcesForm";
import { MissionVisionForm } from "./components/MissionVisionForm";
import { CoreValuesForm } from "./components/CoreValuesForm";
import { ServicesForm } from "./components/ServicesForm";
import { CommitmentForm } from "./components/CommitmentForm";

function ContactInfoSkeleton() {
  return (
    <Stack gap="md" p="lg">
      <Skeleton height={40} radius="md" />
      <Skeleton height={40} radius="md" />
      <Skeleton height={100} radius="md" />
      <Skeleton height={40} radius="md" />
    </Stack>
  );
}

export default function ContactInfoForm() {
  const { t } = useTranslation();
  const contactSchema = getContactSchema(t);
  const { isFetching, isSaving, submit, initialData } = useContactInfoCrud();

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      companyName: "",
      address: "",
      phone: "",
      email: "",
      workingHours: "",
      googleMapUrl: "",
      foundingDate: "",
      companyType: "",
      aboutUs: "",
      yearsOfExperience: 0,
      projectsCompleted: 0,
      satisfiedClients: 0,
      satisfactionRate: 0,
      mission: "",
      vision: "",
      facilitiesIntro: "",
      profileIntro: "",
      coreValuesItems: "",
      coreValuesDescription: "",
      servicesItems: "",
      servicesDescription: "",
      commitmentIntro: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for input[type="date"]
      const formattedData = {
        ...initialData,
        foundingDate: initialData.foundingDate
          ? new Date(initialData.foundingDate).toISOString().split("T")[0]
          : "",
      };

      reset(formattedData);
    } else {
      reset({
        companyName: "",
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        googleMapUrl: "",
        foundingDate: "",
        companyType: "",
        aboutUs: "",
        yearsOfExperience: 0,
        projectsCompleted: 0,
        satisfiedClients: 0,
        satisfactionRate: 0,
        mission: "",
        vision: "",
        facilitiesIntro: "",
        profileIntro: "",
        coreValuesItems: "",
        coreValuesDescription: "",
        servicesItems: "",
        servicesDescription: "",
        commitmentIntro: "",
      });
    }
  }, [initialData, reset]);

  if (isFetching) {
    return <ContactInfoSkeleton />;
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="max-w-4xl mx-auto"
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold">
          {t("admin.contactUsManager.title")}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t("admin.contactUsManager.subtitle")}
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className="p-4 space-y-6">
          <GeneralInfoForm />

          <AboutAndResourcesForm />

          <StatisticsInfoForm />

          <MissionVisionForm />

          <CoreValuesForm />

          <ServicesForm />

          <CommitmentForm />

          <Group justify="flex-end" mt="md">
            <AppButton
              label={t("admin.contactUsManager.form.save")}
              htmlType="submit"
              loading={isSaving}
              disabled={!isDirty}
              showArrow={false}
            />
          </Group>
        </form>
      </FormProvider>
    </Card>
  );
}
