import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

const RawHtml = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

interface MissionVisionSectionProps {
  mission?: string;
  vision?: string;
}

export const MissionVisionSection = ({
  mission,
  vision,
}: MissionVisionSectionProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <section className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`p-6 md:p-10 rounded-xl shadow-sm border ${
          theme === "dark"
            ? "bg-[#242830] border-[#242830]"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="text-center mb-10">
          <h2
            className={`mb-4 font-bold text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            {t("introduction.missionAndVisionLabel")}
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {mission && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-amber-500">
                {t("introduction.about.mission", "Sứ Mệnh")}
              </h3>
              <RawHtml
                html={mission}
                className={`prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight ${
                  theme === "dark"
                    ? "prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white"
                    : "prose-headings:text-black prose-p:text-gray-700 prose-strong:text-black"
                }`}
              />
            </div>
          )}
          {vision && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-orange-600">
                {t("introduction.about.vision", "Tầm Nhìn")}
              </h3>
              <RawHtml
                html={vision}
                className={`prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight ${
                  theme === "dark"
                    ? "prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white"
                    : "prose-headings:text-black prose-p:text-gray-700 prose-strong:text-black"
                }`}
              />
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};
