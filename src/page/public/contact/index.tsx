import ContactPage from "@/components/public/contact";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t("nav.contact")}
        description={t("contact.subtitle")}
        keywords="liên hệ Thiên Lộc, địa chỉ công ty gia công kim loại, hotline Thiên Lộc, email Thiên Lộc"
      />
      <ContactPage />
    </>
  );
}
