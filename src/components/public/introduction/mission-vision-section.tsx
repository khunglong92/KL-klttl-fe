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
    <section>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`max-w-4xl mx-auto space-y-12 shadow p-10 rounded-3xl border ${
            theme === "dark"
              ? "bg-navy-900 border-navy-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="text-center">
            <h2
              className={`mb-4 font-bold text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              {t("introduction.missionAndVisionLabel")}
            </h2>
            <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
          </div>
          {mission && (
            <RawHtml
              html={mission}
              className={`prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight ${
                theme === "dark"
                  ? "prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white"
                  : "prose-headings:text-black prose-p:text-black prose-strong:text-black"
              }`}
            />
          )}
          {vision && (
            <RawHtml
              html={vision}
              className={`prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight ${
                theme === "dark"
                  ? "prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white"
                  : "prose-headings:text-black prose-p:text-black prose-strong:text-black"
              }`}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};
