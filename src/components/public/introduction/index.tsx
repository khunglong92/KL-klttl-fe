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
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { HeroSection } from "./hero-section";
import { AboutSection } from "./about-section";
import { StatsSection } from "./stats-section";
import { MissionVisionSection } from "./mission-vision-section";
import { CoreValuesSection } from "./core-values-section";
import { ServicesSection } from "./services-section";
import { CommitmentSection } from "./commitment-section";

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

  const stats: any = [
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
      <HeroSection companyInfoSection={companyInfoSection} />
      <div className="py-16 md:py-24 container mx-auto px-4 space-y-24">
        <AboutSection aboutUs={companyInfo?.aboutUs} />
      </div>
      <StatsSection stats={stats} />
      <div className="py-16 md:py-24 container mx-auto px-4 space-y-24">
        <MissionVisionSection
          mission={companyInfo?.mission}
          vision={companyInfo?.vision}
        />
        <CoreValuesSection coreValues={coreValues} />
        <ServicesSection services={services} />
        <CommitmentSection />
      </div>
    </div>
  );
}
