import ProjectPublicPage from "@/components/public/projects";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function Project() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("nav.project")}
        description={t("projects.hero.description")}
      />
      <ProjectPublicPage />
    </>
  );
}
