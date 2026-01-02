import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "@/components/public/figma/ImageWithFallback";
import { useTranslation } from "react-i18next";
import useAdminAuth from "../hook/useAdminAuth";
import * as yup from "yup";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { login, isLoading } = useAdminAuth();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const schema = useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .required(
            t("validation.emailRequired", { defaultValue: "Email is required" })
          )
          .email(
            t("validation.emailInvalid", {
              defaultValue: "Invalid email address",
            })
          ),
        password: yup
          .string()
          .required(
            t("validation.passwordRequired", {
              defaultValue: "Password is required",
            })
          )
          .min(
            6,
            t("validation.passwordMin6", {
              defaultValue: "Password must be at least 6 characters",
            })
          ),
      }),
    [i18n.language]
  );

  useEffect(() => {
    if (!errors.email && !errors.password) return;
    (async () => {
      try {
        await schema.validate(credentials, { abortEarly: false });
        setErrors({});
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          Array.isArray((err as any).inner)
        ) {
          const next: { email?: string; password?: string } = {};
          (err as any).inner.forEach((issue: any) => {
            if (issue.path && !next[issue.path as "email" | "password"]) {
              next[issue.path as "email" | "password"] = issue.message;
            }
          });
          setErrors(next);
        }
      }
    })();
  }, [i18n.language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await schema.validate(credentials, { abortEarly: false });
    } catch (err: unknown) {
      if (err && typeof err === "object" && Array.isArray((err as any).inner)) {
        const next: { email?: string; password?: string } = {};
        (err as any).inner.forEach((issue: any) => {
          if (issue.path && !next[issue.path as "email" | "password"]) {
            next[issue.path as "email" | "password"] = issue.message;
          }
        });
        setErrors(next);
        return;
      }
    }
    try {
      await login({ email: credentials.email, password: credentials.password });
      onLogin();
    } catch {
      // Login error is handled by the login function
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background image from Introduction hero */}
      <div className="absolute inset-0 -z-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1747999060057-89b7a533f347?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGZhYnJpY2F0aW9uJTIwZmFjdG9yeXxlbnwxfHx8fDE3NjIwNjk1MTh8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Thiên Lộc Factory"
          className="w-full h-full object-cover"
        />
        {/* Overlays for readability in both themes */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/55 to-black/35 dark:from-black/75 dark:via-black/65 dark:to-black/45" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md p-4"
      >
        {/* Glass card with strong contrast */}
        <div className="rounded-2xl p-px bg-white/10 backdrop-blur-xs shadow-[0_10px_50px_-15px_rgba(0,0,0,0.45)]">
          <Card className="rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 text-white">
            <CardHeader className="space-y-2 text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mx-auto mb-2 h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors"
              >
                <Lock className="h-7 w-7 text-white" />
              </motion.div>
              <CardTitle className="text-2xl tracking-wide">
                {t("admin.header.title")}
              </CardTitle>
              <CardDescription className="text-white/80">
                {t("admin.login.signIn")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">
                    {t("admin.login.username")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("admin.login.placeholderUser")}
                      aria-invalid={!!errors.email}
                      className={`pl-10 h-11 rounded-lg bg-white/15 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-[3px] focus-visible:ring-white/60 ${errors.email ? "border-red-400" : ""}`}
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-300">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">
                    {t("admin.login.password")}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/70" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("admin.login.placeholderPass")}
                      aria-invalid={!!errors.password}
                      className={`pl-10 pr-10 h-11 rounded-lg bg-white/15 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-[3px] focus-visible:ring-white/60 ${errors.password ? "border-red-400" : ""}`}
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-300">
                        {errors.password}
                      </p>
                    )}
                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? t("common.hide", { defaultValue: "Hide" })
                          : t("common.show", { defaultValue: "Show" })
                      }
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-white/80 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 text-white hover:opacity-90 shadow-lg shadow-white/25"
                >
                  {t("admin.login.submit")}
                </Button>
                <div className="text-center text-xs text-white/80">
                  {t("admin.login.demo")}:
                  <span className="font-semibold">
                    {t("admin.login.demoUser")}{" "}
                  </span>
                  / password:
                  <span className="font-semibold">
                    {t("admin.login.demoPass")}
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
