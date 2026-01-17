import { TextInput, Textarea } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ContactFormValues } from "../schema";

export const GeneralInfoForm = () => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext<ContactFormValues>();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("admin.contactUsManager.form.labels.companyName")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.companyName"
              )}
              withAsterisk
              error={errors.companyName?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("admin.contactUsManager.form.labels.phone")}
              placeholder={t("admin.contactUsManager.form.placeholders.phone")}
              withAsterisk
              error={errors.phone?.message}
              {...field}
            />
          )}
        />
      </div>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextInput
            label={t("admin.contactUsManager.form.labels.email")}
            placeholder={t("admin.contactUsManager.form.placeholders.email")}
            type="email"
            withAsterisk
            error={errors.email?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <Textarea
            label={t("admin.contactUsManager.form.labels.address")}
            placeholder={t("admin.contactUsManager.form.placeholders.address")}
            withAsterisk
            error={errors.address?.message}
            autosize
            minRows={3}
            {...field}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="workingHours"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("admin.contactUsManager.form.labels.workingHours")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.workingHours"
              )}
              withAsterisk
              error={errors.workingHours?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="googleMapUrl"
          control={control}
          render={({ field }) => (
            <Textarea
              label={t("admin.contactUsManager.form.labels.googleMapUrl")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.googleMapUrl"
              )}
              error={errors.googleMapUrl?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="foundingDate"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("admin.contactUsManager.form.labels.foundingDate")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.foundingDate"
              )}
              type="date"
              error={errors.foundingDate?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
        <Controller
          name="companyType"
          control={control}
          render={({ field }) => (
            <TextInput
              label={t("admin.contactUsManager.form.labels.companyType")}
              placeholder={t(
                "admin.contactUsManager.form.placeholders.companyType"
              )}
              error={errors.companyType?.message}
              {...field}
              value={field.value ?? ""}
            />
          )}
        />
      </div>
    </>
  );
};
