import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { ArrowRight } from "lucide-react";
import { AppThumbnailImage } from "../common/app-thumbnail-image";
import heroBg from "@/images/common/hero-section-bg.jpg";
export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="relative h-[540px] md:h-[680px] overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <AppThumbnailImage
          src={heroBg}
          alt="Thiên Lộc Metal Processing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/65 to-black/45" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-white mb-6 text-3xl md:text-4xl lg:text-5xl font-bold">
              {t("about.title")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              {t("about.description")}
            </p>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              {t("about.content")}
            </p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <AppButton
                label={t("about.viewProducts")}
                to="/products"
                size="lg"
                variant="default"
                rightSection={<ArrowRight className="h-5 w-5" />}
              />
              <AppButton
                label={t("about.viewServices")}
                to="/services"
                size="lg"
                variant="outline"
                rightSection={<ArrowRight className="h-5 w-5" />}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
