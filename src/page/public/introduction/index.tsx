import { useEffect } from "react";
import IntroPageLayout from "./intro-page-layout";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { AboutSection } from "@/components/public/introduction/about-section";
import { MissionVisionSection } from "@/components/public/introduction/mission-vision-section";
import { CoreValuesSection } from "@/components/public/introduction/core-values-section";
import { ServicesSection } from "@/components/public/introduction/services-section";
import { CommitmentSection } from "@/components/public/introduction/commitment-section";
import { useTranslation } from "react-i18next";
import {
  Target,
  Award,
  Heart,
  Shield,
  Settings,
  Building2,
  Zap,
  Sofa,
  Factory,
  BusFront,
} from "lucide-react";

export default function IntroductionPage() {
  const { t } = useTranslation();
  const { data } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (data) {
      setCompanyInfo(data);
    }
  }, [data, setCompanyInfo]);

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

  return (
    <IntroPageLayout titleKey="introduction_pages.general.hero-title">
      <div className="space-y-12">
        <AboutSection aboutUs={companyInfo?.aboutUs || undefined} />
        <MissionVisionSection
          mission={companyInfo?.mission || undefined}
          vision={companyInfo?.vision || undefined}
        />
        <CoreValuesSection
          coreValues={coreValues}
          customItems={companyInfo?.coreValuesItems || undefined}
          customDescription={companyInfo?.coreValuesDescription || undefined}
        />
        <ServicesSection
          services={services}
          customItems={companyInfo?.servicesItems || undefined}
          customDescription={companyInfo?.servicesDescription || undefined}
        />
        <CommitmentSection
          customContent={companyInfo?.commitmentIntro || undefined}
        />
      </div>
    </IntroPageLayout>
  );
}
