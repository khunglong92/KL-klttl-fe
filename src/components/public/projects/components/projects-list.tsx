import { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  useProjectsPublic,
  useProjectCategories,
} from "../hooks/use-projects-public";
import { ProjectsListItems } from "./projects-list-items";
import { AppThumbnailImage } from "../../common/app-thumbnail-image";
import heroBg from "@/images/common/hero-section-bg.jpg";
import {
  Award,
  Clock,
  Shield,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import AppButton from "@/components/atoms/app-button";
import { Link } from "@tanstack/react-router";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsListComponent() {
  const { projects, loading } = useProjectsPublic();
  const { categories } = useProjectCategories();
  const { t } = useTranslation();
  const { data } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  // Update store when data changes
  useEffect(() => {
    if (data) {
      setCompanyInfo(data);
    }
  }, [data, setCompanyInfo]);

  const hotline = import.meta.env["VITE_PHONE_NUMBER"] || "1900 xxxx";
  const email = import.meta.env["VITE_EMAIL_CONTACT"] || "info@company.com";
  const address =
    import.meta.env["VITE_COMPANY_ADDRESS"] ||
    t("projects.contact.addressFallback");

  const contactCards = useMemo(
    () => [
      {
        icon: Phone,
        label: t("projects.contact.hotlineLabel"),
        value: hotline,
        href: `tel:${hotline}`,
        color: "amber",
      },
      {
        icon: Mail,
        label: t("projects.contact.emailLabel"),
        value: email,
        href: `mailto:${email}`,
        color: "blue",
      },
      {
        icon: MapPin,
        label: t("projects.contact.addressLabel"),
        value: address,
        href: "#",
        color: "green",
      },
    ],
    [address, email, hotline, t]
  );

  const features = [
    {
      icon: Award,
      title: t("projects.features.quality.title"),
      description: t("projects.features.quality.description"),
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Clock,
      title: t("projects.features.timeline.title"),
      description: t("projects.features.timeline.description"),
      gradient: "from-blue-500 to-cyan-600",
    },
    {
      icon: Shield,
      title: t("projects.features.expertise.title"),
      description: t("projects.features.expertise.description"),
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  const achievements = useMemo(
    () => [
      {
        value: companyInfo?.projectsCompleted
          ? `${companyInfo.projectsCompleted}+`
          : "500+",
        label: t("projects.achievements.completed"),
        icon: CheckCircle2,
      },
      {
        value: companyInfo?.yearsOfExperience
          ? `${companyInfo.yearsOfExperience}+`
          : "15+",
        label: t("projects.achievements.experience"),
        icon: Sparkles,
      },
      {
        value: companyInfo?.satisfactionRate
          ? `${companyInfo.satisfactionRate}%`
          : "98%",
        label: t("projects.achievements.satisfaction"),
        icon: Award,
      },
      { value: "24/7", label: t("projects.achievements.support"), icon: Clock },
    ],
    [companyInfo, t]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[540px] md:h-[680px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <AppThumbnailImage
            src={heroBg}
            alt="Projects Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/65 to-black/45" />
        </div>

        {/* Floating Orbs - Subtle overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10 bg-amber-500"
          />
          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, -60, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-10 bg-orange-500"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-10 w-full">
          <div className="max-w-5xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full"
                />
                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center border-2 backdrop-blur-sm bg-amber-500/10 border-amber-500/50">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
                  {t("projects.hero.badge", "Dự án")}
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-white/80">
                  {t("projects.hero.tagline", "Công trình tiêu biểu")}
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl mb-6 leading-[1.1] font-bold text-white"
            >
              <span className="block">
                {t("projects.hero.title1", "Công trình")}
                <span className="text-amber-500">.</span>
              </span>
              <span className="block text-amber-500">
                {t("projects.hero.title2", "Chất lượng")}
              </span>
              <span className="block">
                {t("projects.hero.title3", "Uy tín")}
                <span className="text-amber-500">.</span>
              </span>
            </motion.h1>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-16 bg-linear-to-r from-amber-500 to-transparent rounded-full" />
                <div className="h-px flex-1 bg-white/20" />
              </div>
              <p className="text-lg md:text-xl leading-relaxed max-w-3xl font-light text-white/90">
                {t(
                  "projects.hero.description",
                  "Khám phá những công trình tiêu biểu của chúng tôi"
                )}{" "}
                <span className="font-bold text-amber-400">
                  {t("projects.hero.description2", "từ khắp nơi")}
                </span>
                , {t("projects.hero.description3", "thể hiện sự cam kết")}
                <span className="font-bold text-amber-400">
                  {t("projects.hero.description4", "chất lượng và sáng tạo")}
                </span>
                .
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Link to="/quote">
                <AppButton
                  variant="default"
                  size="lg"
                  label={t("projects.hero.cta.quote", "Yêu cầu báo giá")}
                  leftSection={<Sparkles className="w-5 h-5" />}
                />
              </Link>
              <Link to="/contact">
                <AppButton
                  variant="outline"
                  size="lg"
                  label={t("projects.hero.cta.contact", "Liên hệ ngay")}
                  leftSection={<Phone className="w-5 h-5" />}
                />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {achievements.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative p-4 flex gap-x-2 justify-center items-center rounded-2xl border backdrop-blur-sm transition-all duration-300 bg-white/10 border-white/20 hover:border-amber-500/50 hover:bg-white/20"
                >
                  <stat.icon className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-2xl md:text-3xl font-bold mb-1 text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {t("projects.features.title", "Tại sao chọn chúng tôi")}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 max-w-32 bg-border" />
              <div className="h-1 w-16 bg-linear-to-r from-transparent via-amber-500 to-transparent rounded-full" />
              <div className="h-px flex-1 max-w-32 bg-border" />
            </div>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-center text-muted-foreground">
              {t(
                "projects.features.subtitle",
                "Cam kết chất lượng và dịch vụ xuất sắc"
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative p-8 rounded-3xl flex flex-col justify-center items-center border-2 transition-all duration-500 overflow-hidden group bg-card border-border hover:border-amber-500/50 hover:shadow-2xl"
              >
                {/* Gradient Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-0 flex flex-col justify-center items-center group-hover:opacity-10 transition-opacity duration-500",
                    `bg-linear-to-br ${feature.gradient}`
                  )}
                />
                {/* Icon */}
                <div
                  className={cn(
                    "relative mb-6 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500",
                    `bg-linear-to-br ${feature.gradient}`
                  )}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 relative z-10 text-center text-foreground">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed relative z-10 text-center text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {t("projects.section.title", "Dự án tiêu biểu")}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 max-w-32 bg-border" />
              <div className="h-1 w-16 bg-linear-to-r from-transparent via-amber-500 to-transparent rounded-full" />
              <div className="h-px flex-1 max-w-32 bg-border" />
            </div>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-center text-muted-foreground">
              {t(
                "projects.section.subtitle",
                "Những công trình đã hoàn thành thành công"
              )}
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <ProjectsListItems projects={projects} />
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                {t("projects.categories.title", "Danh mục dự án")}
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 max-w-32 bg-border" />
                <div className="h-1 w-16 bg-linear-to-r from-transparent via-amber-500 to-transparent rounded-full" />
                <div className="h-px flex-1 max-w-32 bg-border" />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-background">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-amber-500" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 bg-orange-500" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {t("projects.contact.title", "Liên hệ với chúng tôi")}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px flex-1 max-w-32 bg-border" />
              <div className="h-1 w-16 bg-linear-to-r from-transparent via-amber-500 to-transparent rounded-full" />
              <div className="h-px flex-1 max-w-32 bg-border" />
            </div>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-muted-foreground">
              {t(
                "projects.contact.subtitle",
                "Sẵn sàng hỗ trợ bạn với giải pháp tốt nhất"
              )}
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactCards.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative p-8 rounded-3xl flex flex-col justify-center items-center border-2 transition-all duration-500 overflow-hidden group bg-card border-border hover:border-amber-500/50 hover:shadow-2xl"
              >
                {/* Gradient Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                    item.color === "amber" &&
                      "bg-linear-to-br from-amber-500 to-orange-600",
                    item.color === "blue" &&
                      "bg-linear-to-br from-blue-500 to-cyan-600",
                    item.color === "green" &&
                      "bg-linear-to-br from-green-500 to-emerald-600"
                  )}
                />
                {/* Icon */}
                <div
                  className={cn(
                    "relative mb-6 w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm border transition-all duration-500 group-hover:scale-110",
                    item.color === "amber" &&
                      "bg-amber-500/20 border-amber-500/50 text-amber-500",
                    item.color === "blue" &&
                      "bg-blue-500/20 border-blue-500/50 text-blue-500",
                    item.color === "green" &&
                      "bg-green-500/20 border-green-500/50 text-green-500"
                  )}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="text-sm font-medium uppercase tracking-wider mb-3 relative z-10 text-center text-muted-foreground">
                  {item.label}
                </div>
                <div className="text-lg md:text-xl font-bold relative z-10 text-foreground">
                  {item.value}
                </div>
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <AppButton
              variant="default"
              size="lg"
              label={t("projects.contact.cta", "Gọi ngay")}
              leftSection={<Phone className="w-5 h-5" />}
              showArrow={false}
              to={`tel:${hotline}`}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background border-border">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm md:text-base">
            {t("projects.contact.footer", "© 2024 Tất cả quyền được bảo lưu")}
          </p>
        </div>
      </footer>
    </div>
  );
}
