import IntroPageLayout from "@/page/public/introduction/intro-page-layout";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export const Facilities = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const companyPhone = import.meta.env["VITE_COMPANY_PHONE"] || "0967853833";
  const companyEmail =
    import.meta.env["VITE_EMAIL_CONTACT"] || "kimloaitamthienloc@gmail.com";
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
    <IntroPageLayout titleKey="introduction_pages.facilities.title">
      <div
        className={`space-y-8 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
      >
        <p className="leading-relaxed text-justify">
          {t("introduction_pages.facilities.intro")}
        </p>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2">
            {t("introduction_pages.facilities.section_a.title")}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.facilities.section_a.p1")}
          </p>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.facilities.section_a.p2")}
          </p>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.facilities.section_a.p3")}
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2">
            {t("introduction_pages.facilities.section_b.title")}
          </h3>
          <p className="leading-relaxed text-justify">
            {t("introduction_pages.facilities.section_b.content")}
          </p>
          <div
            className={`p-4 rounded-lg border-l-4 border-red-500 ${theme === "dark" ? "bg-navy-800" : "bg-red-50"}`}
          >
            <span className="font-bold block mb-2 text-lg text-red-700 dark:text-red-400">
              {t("introduction_pages.facilities.section_b.address_label")}
            </span>
            <span className="text-lg italic line-clamp-2">
              {t("introduction_pages.facilities.section_b.address_value")}
            </span>
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <h3 className="text-2xl font-bold text-[#CF0927] border-b-2 border-red-100 pb-2">
            {t("introduction_pages.facilities.section_c.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`p-6 rounded-xl border text-center transition-all hover:shadow-md ${
                theme === "dark"
                  ? "bg-navy-800 border-navy-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("introduction_pages.facilities.section_c.phone_label")}
              </div>
              <div className="flex gap-x-4 justify-center items-center">
                <a href={`tel:${companyPhone}`}>
                  <div className="relative flex items-center justify-center">
                    {/* Wave */}
                    <motion.span
                      {...waveVisible}
                      className="absolute inset-0 rounded-full bg-green-300"
                    />

                    {/* Icon */}
                    <motion.span
                      {...iconPulse}
                      className="relative z-10 p-2.5 rounded-full text-green-600"
                    >
                      <Phone className="h-8 w-8" />
                    </motion.span>
                  </div>
                </a>
                <a
                  href="tel:0967853833"
                  className="text-xl font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                >
                  {companyPhone}
                </a>
              </div>
            </div>
            <div
              className={`p-6 rounded-xl border text-center transition-all hover:shadow-md ${
                theme === "dark"
                  ? "bg-navy-800 border-navy-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`font-bold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("introduction_pages.facilities.section_c.email_label")}
              </div>
              <a
                href="mailto:kimloaitamthienloc@gmail.com"
                className="text-xl font-bold text-blue-600 underline dark:text-blue-400 hover:text-blue-700 transition-colors break-all"
              >
                {companyEmail}
              </a>
            </div>
          </div>
        </section>
      </div>
    </IntroPageLayout>
  );
};
