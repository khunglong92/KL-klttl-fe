import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LucideIcon,
  Settings,
  Zap,
  Building2,
  Sofa,
  Factory,
  BusFront,
  Home,
  Wrench,
  Cog,
  Truck,
  Hammer,
  Paintbrush,
  Ruler,
  HardHat,
  Warehouse,
  Cpu,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon | string;
}

const hasContent = (html?: string) => {
  if (!html) return false;
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  return stripped.length > 0;
};

interface ServicesSectionProps {
  services: ServiceItem[];
  customItems?: string; // JSON string from API
  customDescription?: string; // Rich text
}

// Icon mapping for JSON items
const iconMap: Record<string, LucideIcon> = {
  Settings,
  Zap,
  Building2,
  Sofa,
  Factory,
  BusFront,
  Home,
  Wrench,
  Cog,
  Truck,
  Hammer,
  Paintbrush,
  Ruler,
  HardHat,
  Warehouse,
  Cpu,
};

const parseItems = (json?: string): ServiceItem[] => {
  try {
    if (!json) return [];
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item: any) => ({
      icon: iconMap[item.icon] || Settings,
      title: item.title || "",
      description: item.description || "",
    }));
  } catch {
    return [];
  }
};

export const ServicesSection = ({
  services,
  customItems,
  customDescription,
}: ServicesSectionProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Use custom items from API if available, otherwise use default services
  const parsedItems = parseItems(customItems);
  const displayItems = parsedItems.length > 0 ? parsedItems : services;

  return (
    <section>
      <div>
        {/* ===== Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2
            className={`mb-4 text-3xl font-bold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {t("introduction.servicesLabel")}
          </h2>

          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-linear-to-r from-amber-500 to-orange-600" />

          {hasContent(customDescription) ? (
            <div
              className={`ql-snow ql-editor mx-auto max-w-2xl ${theme === "dark" ? "text-gray-200" : "text-black"}`}
              dangerouslySetInnerHTML={{ __html: customDescription! }}
            />
          ) : (
            <p
              className={`mx-auto max-w-2xl ${
                theme === "dark" ? "text-gray-200" : "text-black"
              }`}
            >
              {t("introduction.servicesDescription")}
            </p>
          )}
        </motion.div>

        {/* ===== Services Grid ===== */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {displayItems.map((service, index) => {
            const Icon =
              typeof service.icon === "string"
                ? iconMap[service.icon] || Settings
                : service.icon;

            // 👉 rule: nếu tổng lẻ & item cuối → căn giữa
            const isLastOdd =
              displayItems.length % 2 === 1 &&
              index === displayItems.length - 1;

            return (
              <motion.div
                key={service.title + index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className={`group rounded-xl border p-6 shadow-xl transition-all duration-300 hover:ring-1 hover:shadow-xl ring-amber-100
                  ${
                    theme === "dark"
                      ? "bg-navy-900 border-navy-700"
                      : "bg-white border-gray-100"
                  }
                  ${isLastOdd ? "md:col-span-2 md:mx-auto md:max-w-xl" : ""}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-linear-to-br from-amber-500 to-orange-600 p-3 transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`mb-2 text-xl font-semibold transition-colors group-hover:text-amber-600 ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {service.title}
                    </h3>

                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-200" : "text-black"
                      }`}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
