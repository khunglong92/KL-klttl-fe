import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import contactBg from "@/images/common/contact-bg.jpg";
import { useTranslation } from "react-i18next";
import { LucideIcon } from "lucide-react";

interface CompanyInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

interface HeroSectionProps {
  companyInfoSection: CompanyInfoItem[];
}

export const HeroSection = ({ companyInfoSection }: HeroSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative h-[540px] md:h-[680px] overflow-hidden">
      <div className="absolute inset-0">
        <AppThumbnailImage
          src={contactBg}
          alt={t("introduction.hero.alt")}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/65 to-black/45" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-white">
              {t("introduction.companyName")}
            </Badge>
            <h1 className="text-white mb-6 text-3xl md:text-4xl lg:text-5xl">
              {t("introduction.companyName")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {t("introduction.companyDescription")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl"
          >
            {companyInfoSection?.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md flex flex-col justify-center items-center rounded-xl p-4 border border-white/20 min-h-[88px]"
                >
                  <div
                    className={`inline-flex p-2 rounded-lg bg-linear-to-br ${info.color} mb-2`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xs text-white/70 mb-1">{info.label}</p>
                  <p className="text-sm text-white text-center">{info.value}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
