import { motion } from "framer-motion";
import { useEffect } from "react";

import {
  Building2,
  Calendar,
  MapPin,
  Phone,
  Target,
  Award,
  Users,
  Settings,
  TrendingUp,
  Shield,
  Heart,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppThumbnailImage } from "@/components/public/common/app-thumbnail-image";
import contactBg from "@/images/common/contact-bg.jpg";
import herosectionBg from "@/images/common/hero-section-bg.jpg";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const RawHtml = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

export default function Introduction() {
  const { t } = useTranslation();
  const { data } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (data) {
      setCompanyInfo(data);
    }
  }, [data, setCompanyInfo]);

  const companyInfoSection = [
    {
      icon: Calendar,
      label: t("introduction.companyInfo.foundingDate"),
      value: companyInfo?.foundingDate
        ? dayjs(companyInfo.foundingDate).format("DD/MM/YYYY")
        : "N/A",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MapPin,
      label: t("introduction.companyInfo.address"),
      value: companyInfo?.address || "N/A",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Phone,
      label: t("introduction.companyInfo.hotline"),
      value: companyInfo?.phone || "N/A",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Building2,
      label: t("introduction.companyInfo.companyType"),
      value: companyInfo?.companyType || "N/A",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const coreValues = [
    {
      icon: Target,
      title: t("introduction.coreValues.precision.title"),
      description: t("introduction.coreValues.precision.description"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Award,
      title: t("introduction.coreValues.quality.title"),
      description: t("introduction.coreValues.quality.description"),
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Heart,
      title: t("introduction.coreValues.dedication.title"),
      description: t("introduction.coreValues.dedication.description"),
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Shield,
      title: t("introduction.coreValues.reputation.title"),
      description: t("introduction.coreValues.reputation.description"),
      color: "from-green-500 to-emerald-600",
    },
  ];

  const services = [
    {
      title: t("introduction.services.mechanicalEngineering"),
      description: t("introduction.services.mechanicalEngineeringDescription"),
      icon: Settings,
    },
    {
      title: t("introduction.services.electricalEngineering"),
      description: t("introduction.services.electricalEngineeringDescription"),
      icon: Sparkles,
    },
    {
      title: t("introduction.services.construction"),
      description: t("introduction.services.constructionDescription"),
      icon: Building2,
    },
    {
      title: t("introduction.services.transportation"),
      description: t("introduction.services.transportationDescription"),
      icon: TrendingUp,
    },
  ];

  const stats = [
    {
      value: companyInfo?.yearsOfExperience || "0",
      label: t("introduction.stats.yearsOfExperience"),
      icon: Award,
    },
    {
      value: (companyInfo?.projectsCompleted || "0") + "+",
      label: t("introduction.stats.projectsCompleted"),
      icon: Target,
    },
    {
      value: companyInfo?.satisfiedClients || "0",
      label: t("introduction.stats.satisfiedClients"),
      icon: Users,
    },
    {
      value: (companyInfo?.satisfactionRate || "0") + "%",
      label: t("introduction.stats.satisfactionRate"),
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

            {/* Company Quick Info */}
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
                    <p className="text-sm text-white text-center">
                      {info.value}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="mb-4">{t("introduction.aboutUsLabel")}</h2>
                <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mb-6" />
              </div>

              {companyInfo?.aboutUs && (
                <RawHtml
                  html={companyInfo.aboutUs}
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground"
                />
              )}
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

              {/* Decorative elements */}
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

      {/* Stats Section - Orange gradient band */}
      <section
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          backgroundImage: `url(${contactBg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gradient */}

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-6xl rounded-2xl bg-white/15 backdrop-blur-lg px-6 py-10 md:py-14 shadow-2xl border border-white/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="text-center group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex p-4 rounded-full bg-white/25 backdrop-blur-sm mb-4 group-hover:bg-white/35 transition-colors shadow-lg"
                    >
                      <Icon className="h-8 w-8 text-white drop-shadow-lg" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div
                        className="text-4xl md:text-5xl font-extrabold text-white mb-2 group-hover:scale-110 transition-transform"
                        style={{
                          textShadow:
                            "0 2px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-white font-semibold text-sm md:text-base"
                        style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)" }}
                      >
                        {stat.label}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl" />
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-12 shadow-xl hover:shadow-2xl p-10 rounded-3xl bg-white/15 backdrop-blur-lg border border-white/30"
          >
            <div className="text-center">
              <h2 className="mb-4">
                {t("introduction.missionAndVisionLabel")}
              </h2>
              <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
            </div>
            {companyInfo?.mission && (
              <RawHtml
                html={companyInfo.mission}
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground"
              />
            )}
            {companyInfo?.vision && (
              <RawHtml
                html={companyInfo.vision}
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground"
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">{t("introduction.coreValuesLabel")}</h2>
            <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("introduction.coreValuesDescription")}
            </p>
          </motion.div>

          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="bg-card rounded-2xl flex flex-col justify-center items-center p-6 shadow-xl hover:shadow-2xl hover:ring-1 hover:ring-amber-50 transition-all duration-300 border text-left"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 rounded-xl bg-linear-to-br ${value.color} mb-4`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services/Applications */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">{t("introduction.servicesLabel")}</h2>
            <div className="w-20 h-1 bg-linear-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("introduction.servicesDescription")}
            </p>
          </motion.div>

          <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card rounded-xl p-6 shadow-xl hover:ring-1 ring-amber-100 hover:shadow-xl transition-all duration-300 border group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 group-hover:text-amber-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
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

      {/* Commitment Section - Dark blue band */}
      <section className="py-16 md:py-24 bg-muted-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-white mb-6">
                {t("introduction.commitmentLabel")}
              </h2>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {t("introduction.commitmentDescription")}
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block"
              >
                <div className="text-3xl md:text-4xl text-amber-400 mb-4">
                  {t("introduction.commitment.companyName")}
                </div>
                <div className="text-xl text-white/80">
                  {t("introduction.commitment.slogan")}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
