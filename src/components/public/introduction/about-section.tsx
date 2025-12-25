import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import herosectionBg from "@/images/common/hero-section-bg.jpg";
import { useTheme } from "@/hooks/useTheme";

const RawHtml = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

interface AboutSectionProps {
  aboutUs?: string;
}

export const AboutSection = ({ aboutUs }: AboutSectionProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h2
                className={`mb-4 font-bold text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("introduction.aboutUsLabel")}
              </h2>
              <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mb-6" />
            </div>
            {aboutUs && (
              <RawHtml
                html={aboutUs}
                className={`prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight ${
                  theme === "dark"
                    ? "prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-li:text-gray-200"
                    : "prose-headings:text-black prose-p:text-black prose-strong:text-black prose-li:text-black"
                }`}
              />
            )}
            1111
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <AppThumbnailImage
                src={herosectionBg}
                alt="Manufacturing"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -bottom-6 -right-6 w-40 h-40 bg-linear-to-br from-amber-500 to-orange-600 rounded-full opacity-20 blur-3xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
