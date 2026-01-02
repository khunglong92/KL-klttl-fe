import { useMutation } from "@tanstack/react-query";
import { getLoginSchema } from "@/lib/validations/auth";
import {
  authService,
  type AuthResponse,
  type LoginRequest,
} from "@/services/api/authService";
import { useAuthStore } from "@/stores/authStore";
import { LoginFormValues } from "../types";
import { showNotification } from "@mantine/notifications";
import i18n from "@/lib/i18n/config";

export default function useAdminAuth() {
  const loginStore = useAuthStore((s) => s.login);

  const mutation = useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (payload) => {
      return authService.login(payload);
    },
    onSuccess: async (res) => {
      const anyRes: any = res;
      const token =
        anyRes?.data?.token ||
        anyRes?.token ||
        anyRes?.accessToken ||
        anyRes?.access_token ||
        "";
      const refreshToken =
        anyRes?.data?.refreshToken ||
        anyRes?.refreshToken ||
        anyRes?.refresh_token ||
        null;

      // Nếu có token thì lưu vào store (không cần check success nữa)
      if (token) {
        try {
          await loginStore(token, refreshToken ?? null);

          showNotification({
            title: i18n.t("login.success"),
            message: (res as any)?.message || i18n.t("login.successMessage"),
            color: "green",
          });
        } catch {
          showNotification({
            title: i18n.t("login.error"),
            message: (res as any)?.message || i18n.t("login.errorMessage"),
            color: "green",
          });
        }
      } else {
        showNotification({
          title: i18n.t("login.error"),
          message:
            (res as any)?.message ||
            i18n.t("validation.invalidCredentials", {
              defaultValue: i18n.t("login.errorMessage"),
            }),
          color: "red",
        });
      }
    },
    onError: (err) => {
      showNotification({
        title: i18n.t("login.error"),
        message:
          err.message ||
          i18n.t("login.errorMessage", {
            defaultValue: i18n.t("login.errorMessage"),
          }),
        color: "red",
      });
    },
  });

  const validateAndLogin = async (values: LoginFormValues) => {
    const parsed = getLoginSchema().safeParse(values);
    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message || "Invalid form";
      showNotification({
        title: "Invalid form",
        message: msg,
        color: "red",
      });
      throw new Error(msg);
    }
    return mutation.mutateAsync(parsed.data);
  };

  return {
    login: validateAndLogin,
    isLoading: mutation.isPending,
  };
}
