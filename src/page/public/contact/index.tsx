import ContactPage from "@/components/public/contact";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("nav.contact")} description={t("contact.subtitle")} />
      <ContactPage />
    </>
  );
}
