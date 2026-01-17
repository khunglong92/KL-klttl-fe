import { NumberInput } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";

export const StatisticsInfoForm = () => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="yearsOfExperience"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={t("admin.contactUsManager.form.labels.yearsOfExperience")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.yearsOfExperience"
              )}
              min={0}
              error={errors.yearsOfExperience?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="projectsCompleted"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={t("admin.contactUsManager.form.labels.projectsCompleted")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.projectsCompleted"
              )}
              min={0}
              error={errors.projectsCompleted?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="satisfiedClients"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={t("admin.contactUsManager.form.labels.satisfiedClients")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.satisfiedClients"
              )}
              min={0}
              error={errors.satisfiedClients?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="satisfactionRate"
          control={control}
          render={({ field }) => (
            <NumberInput
              label={t("admin.contactUsManager.form.labels.satisfactionRate")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.satisfactionRate"
              )}
              min={0}
              max={100}
              error={errors.satisfactionRate?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>
    </>
  );
};
