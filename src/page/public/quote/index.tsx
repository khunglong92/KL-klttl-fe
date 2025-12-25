import QuotePage from "@/components/public/quote";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function Quote() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("nav.quote")} description={t("nav.companyDescription")} />
      <QuotePage />
    </>
  );
}
