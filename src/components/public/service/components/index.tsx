import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ServiceListItem } from "@/components/public/service/components/service-list-items";
import { Skeleton } from "@/components/ui/skeleton";
import useServicesPublic from "../hooks/use-services-public";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { AppThumbnailImage } from "../../common/app-thumbnail-image";

export function ServicesListComponent() {
  const { services, loading, whyChooseUs } = useServicesPublic();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <AppThumbnailImage
            src="https://images.unsplash.com/photo-1699791913444-87cc77afd432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc2VydmljZXN8ZW58MXx8fHwxNzYyMTc5ODExfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Services Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-white">
              {t("servicesPage.hero.badge")}
            </Badge>
            <h1 className="text-white mb-6 text-3xl md:text-4xl lg:text-5xl">
              {t("servicesPage.hero.title")}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {t("servicesPage.hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">{t("servicesPage.main.title")}</h2>
            <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("servicesPage.main.subtitle")}
            </p>
          </motion.div>

          {loading ? (
            <div className="space-y-16">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <ServiceListItem services={services} />
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-linear-to-br from-slate-400 to-indigo-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-white">
              {t("servicesPage.whyChooseUs.title")}
            </h2>
            <div className="w-20 h-1 bg-white/50 rounded-full mx-auto mb-6" />
            <p className="text-white/90 max-w-2xl mx-auto text-lg">
              {t("servicesPage.whyChooseUs.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex p-4 rounded-full bg-white/20 mb-4"
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="mb-3 text-white">{t(item.title)}</h3>
                  <p className="text-white/80 text-sm">{t(item.description)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center bg-card rounded-3xl p-8 md:p-12 shadow-xl border-2"
          >
            <h2 className="mb-4">{t("servicesPage.cta.title")}</h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              {t("servicesPage.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AppButton
                variant="default"
                label={t("servicesPage.cta.contactButton")}
                to="/contact"
              />

              <AppButton
                variant="outline-primary"
                label={t("servicesPage.cta.quoteButton")}
                to="/quote"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
