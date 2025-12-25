import { ServicesListComponent } from "@/components/public/service/components";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function ServicesListPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("nav.services")}
        description={t("servicesPage.hero.subtitle")}
      />
      <ServicesListComponent />
    </>
  );
}
