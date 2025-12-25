import { motion } from "framer-motion";
import IntroPageLayout from "@/page/public/introduction/intro-page-layout";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import {
  Shield,
  Lock,
  FileText,
  Share2,
  Mail,
  Phone,
  Calendar,
  Info,
} from "lucide-react";

export const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const companyPhone = import.meta.env["VITE_COMPANY_PHONE"] || "0967853833";
  const companyEmail =
    import.meta.env["VITE_EMAIL_CONTACT"] || "kimloaitamthienloc@gmail.com";

  // ANIMATION VARIANTS
  const waveVisible = {
    animate: {
      scale: [1, 1.45],
      opacity: [0.35, 0],
    },
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeOut",
    },
  };

  const iconPulse = {
    animate: {
      scale: [1, 1.12, 1],
    },
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <IntroPageLayout titleKey="introduction_pages.privacy.title">
      <div
        className={`space-y-12 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        {/* Intro Section */}
        <div className="space-y-4">
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.privacy.p1")}
          </p>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.privacy.p2")}
          </p>
        </div>

        <hr
          className={theme === "dark" ? "border-navy-700" : "border-gray-100"}
        />

        {/* Collection Section */}
        <section className="space-y-5">
          <h3 className="text-2xl font-bold text-[#CF0927] flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {t("introduction_pages.privacy.collection.title")}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.privacy.collection.intro")}
          </p>
          <div
            className={`p-6 rounded-2xl border ${theme === "dark" ? "bg-navy-800/50 border-navy-700" : "bg-gray-50 border-gray-100"}`}
          >
            <p className="font-semibold mb-4 text-gray-900 dark:text-gray-100 italic">
              {t("introduction_pages.privacy.collection.extra")}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                t("introduction_pages.privacy.collection.list", {
                  returnObjects: true,
                }) as string[]
              ).map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="leading-relaxed text-justify italic text-sm">
            {t("introduction_pages.privacy.collection.footer")}
          </p>
        </section>

        {/* Usage Section */}
        <section className="space-y-5">
          <h3 className="text-2xl font-bold text-[#CF0927] flex items-center gap-2">
            <Info className="w-6 h-6" />
            {t("introduction_pages.privacy.usage.title")}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.privacy.usage.intro")}
          </p>
          <ul className="space-y-3 pl-2">
            {(
              t("introduction_pages.privacy.usage.list", {
                returnObjects: true,
              }) as string[]
            ).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-500 transition-colors">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 group-hover:text-white">
                    {idx + 1}
                  </span>
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 rounded-r-lg">
            <p className="text-sm font-medium italic text-blue-700 dark:text-blue-400">
              {t("introduction_pages.privacy.usage.footer")}
            </p>
          </div>
        </section>

        {/* Sharing Section */}
        <section className="space-y-5">
          <h3 className="text-2xl font-bold text-[#CF0927] flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            {t("introduction_pages.privacy.sharing.title")}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.privacy.sharing.intro")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-5 rounded-xl border ${theme === "dark" ? "bg-navy-800 border-navy-700" : "bg-white border-gray-200 shadow-sm"}`}
            >
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 underline decoration-red-200 underline-offset-4">
                {t("introduction_pages.privacy.sharing.consent_title")}
              </h4>
              <p className="text-sm leading-relaxed">
                {t("introduction_pages.privacy.sharing.consent_body")}
              </p>
            </div>
            <div
              className={`p-5 rounded-xl border ${theme === "dark" ? "bg-navy-800 border-navy-700" : "bg-white border-gray-200 shadow-sm"}`}
            >
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-2 underline decoration-red-200 underline-offset-4">
                {t("introduction_pages.privacy.sharing.legal_title")}
              </h4>
              <p className="text-sm leading-relaxed">
                {t("introduction_pages.privacy.sharing.legal_body")}
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-5">
          <h3 className="text-2xl font-bold text-[#CF0927] flex items-center gap-2">
            <Lock className="w-6 h-6" />
            {t("introduction_pages.privacy.security.title")}
          </h3>
          <div
            className={`p-6 rounded-2xl border-2 border-dashed ${theme === "dark" ? "border-navy-700 bg-navy-900/50" : "border-gray-200 bg-gray-50/50"}`}
          >
            <p className="leading-relaxed text-justify italic">
              {t("introduction_pages.privacy.security.content")}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="space-y-5">
          <h3 className="text-2xl font-bold text-[#CF0927] flex items-center gap-2">
            <Mail className="w-6 h-6" />
            {t("introduction_pages.privacy.contact.title")}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.privacy.contact.intro")}
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex items-center gap-4 group">
              <div className="relative flex items-center justify-center">
                {/* Wave */}
                <motion.span
                  {...waveVisible}
                  className="absolute inset-0 rounded-full bg-blue-500"
                />

                {/* Icon */}
                <motion.span
                  {...iconPulse}
                  className="relative z-10 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors"
                >
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </motion.span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("introduction_pages.privacy.contact.email_label")}
                </span>
                <a
                  href={`mailto:${companyEmail}`}
                  className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {companyEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="relative flex items-center justify-center">
                {/* Wave */}
                <motion.span
                  {...waveVisible}
                  className="absolute inset-0 rounded-full bg-green-500/40"
                />

                {/* Icon */}
                <motion.span
                  {...iconPulse}
                  className="relative z-10 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-500 transition-colors"
                >
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                </motion.span>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("introduction_pages.privacy.contact.hotline_label")}
                </span>
                <a
                  href={`tel:${companyPhone.replace(/\s+/g, "")}`}
                  className="text-lg font-bold text-green-600 dark:text-green-400 hover:underline"
                >
                  {companyPhone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Changes Section */}
        <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-navy-800">
          <h4
            className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"} flex items-center gap-2`}
          >
            <Shield className="w-5 h-5 text-blue-400" />
            {t("introduction_pages.privacy.changes.title")}
          </h4>
          <p className="leading-relaxed text-sm text-justify">
            {t("introduction_pages.privacy.changes.content")}
          </p>
        </section>

        {/* Time Section */}
        <div
          className={`p-4 rounded-xl flex items-center gap-4 ${theme === "dark" ? "bg-navy-800/50" : "bg-gray-100"}`}
        >
          <Calendar className="w-5 h-5 text-gray-400" />
          <p className="text-xs font-medium text-gray-500">
            <span
              className={`font-bold mr-2 uppercase tracking-tighter ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {t("introduction_pages.privacy.time.title")}:
            </span>
            {t("introduction_pages.privacy.time.content")}
          </p>
        </div>
      </div>
    </IntroPageLayout>
  );
};
