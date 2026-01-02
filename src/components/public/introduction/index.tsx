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
  Shield,
  Heart,
  Zap,
  Sofa,
  Factory,
  BusFront,
} from "lucide-react";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { HeroSection, CompanyInfoItem } from "./hero-section";
import { AboutSection } from "./about-section";
import { StatsSection, StatItem } from "./stats-section";
import { MissionVisionSection } from "./mission-vision-section";
import { CoreValuesSection, CoreValueItem } from "./core-values-section";
import { ServicesSection, ServiceItem } from "./services-section";
import { CommitmentSection } from "./commitment-section";

import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_COMPANY_INFO } from "./constants";

export default function Introduction() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { data } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (data) {
      setCompanyInfo(data);
    }
  }, [data, setCompanyInfo]);

  // Use store data if available, otherwise fallback to DEFAULT_COMPANY_INFO
  // We prefer store data (coming from API) but if it's null (initial state) or incomplete, we can rely on defaults.
  // However, usually we want to show loading state or similar, but here requirement is to show default content.
  const displayInfo = companyInfo || DEFAULT_COMPANY_INFO;

  const companyInfoSection: CompanyInfoItem[] = [
    {
      icon: Calendar,
      label: t("introduction.companyInfo.foundingDate"),
      value: displayInfo?.foundingDate
        ? dayjs(displayInfo.foundingDate).format("DD/MM/YYYY")
        : "N/A",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MapPin,
      label: t("introduction.companyInfo.address"),
      value: displayInfo?.address || "N/A",
      color: "from-red-500 to-pink-600",
    },
    {
      icon: Phone,
      label: t("introduction.companyInfo.hotline"),
      value: displayInfo?.phone || "N/A",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Building2,
      label: t("introduction.companyInfo.companyType"),
      value: displayInfo?.companyType || "N/A",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  const coreValues: CoreValueItem[] = [
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

  const services: ServiceItem[] = [
    {
      title: t("introduction.services.mechanicalEngineering"),
      description: t("introduction.services.mechanicalEngineeringDescription"),
      icon: Settings,
    },
    {
      title: t("introduction.services.electricalEngineering"),
      description: t("introduction.services.electricalEngineeringDescription"),
      icon: Zap,
    },
    {
      title: t("introduction.services.construction"),
      description: t("introduction.services.constructionDescription"),
      icon: Building2,
    },
    {
      title: t("introduction.services.interior"),
      description: t("introduction.services.interiorDescription"),
      icon: Sofa,
    },
    {
      title: t("introduction.services.industrial"),
      description: t("introduction.services.industrialDescription"),
      icon: Factory,
    },
    {
      title: t("introduction.services.transportation"),
      description: t("introduction.services.transportationDescription"),
      icon: BusFront,
    },
  ];

  const stats: StatItem[] = [
    {
      value: String(displayInfo?.yearsOfExperience || "0"),
      label: t("introduction.stats.yearsOfExperience"),
      icon: Award,
    },
    {
      value: String(displayInfo?.projectsCompleted || "0") + "+",
      label: t("introduction.stats.projectsCompleted"),
      icon: Target,
    },
    {
      value: String(displayInfo?.satisfiedClients || "0"),
      label: t("introduction.stats.satisfiedClients"),
      icon: Users,
    },
    {
      value: String(displayInfo?.satisfactionRate || "0") + "%",
      label: t("introduction.stats.satisfactionRate"),
      icon: Heart,
    },
  ];

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-navy-950" : "bg-[#f8f9fa]"}`}
    >
      <HeroSection companyInfoSection={companyInfoSection} />
      <div className="py-16 md:py-24 container mx-auto px-4 space-y-24">
        <AboutSection aboutUs={displayInfo?.aboutUs} />
      </div>
      <StatsSection stats={stats} />
      <div className="py-16 md:py-24 container mx-auto px-4 space-y-24">
        <MissionVisionSection
          mission={displayInfo?.mission}
          vision={displayInfo?.vision}
        />
        <CoreValuesSection coreValues={coreValues} />
        <ServicesSection services={services} />
        <CommitmentSection />
      </div>
    </div>
  );
}
