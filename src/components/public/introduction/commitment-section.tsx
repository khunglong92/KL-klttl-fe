import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export const CommitmentSection = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section
      className={`py-10 rounded-2xl ${theme === "dark" ? "bg-navy-800" : "bg-gray-50"}`}
    >
      <div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`mb-6 font-bold text-3xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("introduction.commitmentLabel")}
            </h2>
            <p
              className={`text-xl leading-relaxed mb-8 ${theme === "dark" ? "text-gray-200" : "text-black"}`}
            >
              {t("introduction.commitmentDescription")}
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block"
            >
              <div className="text-3xl md:text-4xl text-accent-red mb-4 font-bold">
                {t("introduction.commitment.companyName")}
              </div>
              <div
                className={`text-xl ${theme === "dark" ? "text-gray-200" : "text-black"}`}
              >
                {t("introduction.commitment.slogan")}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
