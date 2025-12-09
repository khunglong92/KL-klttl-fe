import { z } from "zod";
import i18n from "@/lib/i18n/config";

export const getLoginSchema = () =>
  z.object({
    email: z
      .string()
      .min(
        1,
        i18n.t("validation.emailRequired", {
          defaultValue: "Email is required",
        })
      )
      .email(
        i18n.t("validation.emailInvalid", {
          defaultValue: "Invalid email address",
        })
      ),
    password: z
      .string()
      .min(
        1,
        i18n.t("validation.passwordRequired", {
          defaultValue: "Password is required",
        })
      )
      .min(
        6,
        i18n.t("validation.passwordMin6", {
          defaultValue: "Password must be at least 6 characters",
        })
      ),
  });

export const getRegisterSchema = () =>
  z
    .object({
      name: z.string().min(
        2,
        i18n.t("validation.nameMin2", {
          defaultValue: "Name must be at least 2 characters",
        })
      ),
      email: z
        .string()
        .min(
          1,
          i18n.t("validation.emailRequired", {
            defaultValue: "Email is required",
          })
        )
        .email(
          i18n.t("validation.emailInvalid", {
            defaultValue: "Invalid email address",
          })
        ),
      password: z
        .string()
        .min(
          1,
          i18n.t("validation.passwordRequired", {
            defaultValue: "Password is required",
          })
        )
        .min(
          6,
          i18n.t("validation.passwordMin6", {
            defaultValue: "Password must be at least 6 characters",
          })
        ),
      confirmPassword: z.string().min(
        1,
        i18n.t("validation.passwordRequired", {
          defaultValue: "Password is required",
        })
      ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t("validation.passwordsNotMatch", {
        defaultValue: "Passwords do not match",
      }),
      path: ["confirmPassword"],
    });

export const getResetPasswordSchema = () =>
  z.object({
    email: z
      .string()
      .min(
        1,
        i18n.t("validation.emailRequired", {
          defaultValue: "Email is required",
        })
      )
      .email(
        i18n.t("validation.emailInvalid", {
          defaultValue: "Invalid email address",
        })
      ),
  });

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof getRegisterSchema>>;
export type ResetPasswordFormData = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>;
