import { servicesService } from "@/services/api/servicesService";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Sparkles, Settings, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function useServicesPublic() {
  const { t } = useTranslation();
  const { data: services = [], isLoading: loading } = useQuery({
    queryKey: ["services"],
    queryFn: () => servicesService.findAll({ perpage: 100 }),
    select: (data) => data.data,
  });

  const whyChooseUs = [
    {
      icon: CheckCircle2,
      title: t("servicesPage.whyChooseUs.quality.title"),
      description: t("servicesPage.whyChooseUs.quality.description"),
    },
    {
      icon: Sparkles,
      title: t("servicesPage.whyChooseUs.technology.title"),
      description: t("servicesPage.whyChooseUs.technology.description"),
    },
    {
      icon: Settings,
      title: t("servicesPage.whyChooseUs.experience.title"),
      description: t("servicesPage.whyChooseUs.experience.description"),
    },
    {
      icon: Zap,
      title: t("servicesPage.whyChooseUs.support.title"),
      description: t("servicesPage.whyChooseUs.support.description"),
    },
  ];

  return { services, loading, whyChooseUs };
}
