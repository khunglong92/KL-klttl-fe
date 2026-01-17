import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LucideIcon,
  Target,
  Award,
  Heart,
  Shield,
  Star,
  CheckCircle,
  Zap,
  Users,
  Handshake,
  Lightbulb,
  Clock,
  Smile,
  ThumbsUp,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export interface CoreValueItem {
  icon: LucideIcon | string;
  title: string;
  description: string;
  color: string;
}

const hasContent = (html?: string) => {
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  return stripped.length > 0;
};

interface CoreValuesSectionProps {
  coreValues: CoreValueItem[];
  customItems?: string; // JSON string from API
  customDescription?: string; // Rich text
}

// Icon mapping for JSON items
const iconMap: Record<string, LucideIcon> = {
  Target,
  Award,
  Heart,
  Shield,
  Star,
  CheckCircle,
  Zap,
  Users,
  Handshake,
  Lightbulb,
  Clock,
  Smile,
  ThumbsUp,
};

const parseItems = (json?: string): CoreValueItem[] => {
  try {
    if (!json) return [];
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) => ({
      icon: iconMap[item.icon] || Target,
      title: item.title || "",
      description: item.description || "",
      color: item.color || "from-blue-500 to-cyan-500",
    }));
  } catch {
    return [];
  }
};

export const CoreValuesSection = ({
  coreValues,
  customItems,
  customDescription,
}: CoreValuesSectionProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Use custom items from API if available, otherwise use default coreValues
  const parsedItems = parseItems(customItems);
  const displayItems = parsedItems.length > 0 ? parsedItems : coreValues;

  return (
    <section className="">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`mb-4 font-bold text-3xl ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            {t("introduction.coreValuesLabel")}
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
          {hasContent(customDescription) ? (
            <div
              className={`ql-snow ql-editor max-w-2xl mx-auto ${theme === "dark" ? "text-gray-200" : "text-black"}`}
              dangerouslySetInnerHTML={{ __html: customDescription! }}
            />
          ) : (
            <p
              className={`max-w-2xl mx-auto ${theme === "dark" ? "text-gray-200" : "text-black"}`}
            >
              {t("introduction.coreValuesDescription")}
            </p>
          )}
        </motion.div>

        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayItems.map((value, index) => {
            const Icon =
              typeof value.icon === "string"
                ? iconMap[value.icon] || Target
                : value.icon;
            return (
              <motion.div
                key={value.title + index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className={`rounded-2xl flex flex-col justify-center items-center p-6 shadow-xl hover:shadow-2xl hover:ring-1 hover:ring-amber-50 transition-all duration-300 border text-left ${
                  theme === "dark"
                    ? "bg-navy-900 border-navy-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-xl bg-linear-to-br ${value.color} mb-4`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3
                  className={`mb-3 font-semibold text-xl ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  {value.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed text-center ${theme === "dark" ? "text-gray-200" : "text-black"}`}
                >
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
