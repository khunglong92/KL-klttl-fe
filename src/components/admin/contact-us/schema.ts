import { z } from "zod";

export const getContactSchema = (t: (key: string) => string) =>
  z.object({
    companyName: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required")),
    address: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required")),
    phone: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required"))
      .regex(
        /^[0-9]+$/,
        t("admin.contactUsManager.form.validation.phoneInvalid")
      ),
    email: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required"))
      .email({
        message: t("admin.contactUsManager.form.validation.emailInvalid"),
      }),
    workingHours: z
      .string()
      .min(1, t("admin.contactUsManager.form.validation.required")),
    googleMapUrl: z.string().nullish(),
    foundingDate: z.string().nullish(),
    companyType: z.string().nullish(),
    aboutUs: z.string().nullish(),
    yearsOfExperience: z.number().int().min(0).nullish().or(z.literal(0)),
    projectsCompleted: z.number().int().min(0).nullish().or(z.literal(0)),
    satisfiedClients: z.number().int().min(0).nullish().or(z.literal(0)),
    satisfactionRate: z
      .number()
      .int()
      .min(0)
      .max(100)
      .nullish()
      .or(z.literal(0)),
    mission: z.string().nullish(),
    vision: z.string().nullish(),
    facilitiesIntro: z.string().nullish(),
    profileIntro: z.string().nullish(),
    coreValuesItems: z.string().nullish(),
    coreValuesDescription: z.string().nullish(),
    servicesItems: z.string().nullish(),
    servicesDescription: z.string().nullish(),
    commitmentIntro: z.string().nullish(),
  });

export type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;
