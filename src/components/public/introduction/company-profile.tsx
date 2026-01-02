import IntroPageLayout from "@/page/public/introduction/intro-page-layout";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useGetContactInfo } from "@/services/hooks/useContactInfo";
import { useContactInfoStore } from "@/stores/contactInfoStore";
import { useEffect } from "react";

export const CompanyProfile = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Fetch contact info
  const { data: contactInfo } = useGetContactInfo();
  const { setCompanyInfo, companyInfo } = useContactInfoStore();

  useEffect(() => {
    if (contactInfo) {
      setCompanyInfo(contactInfo);
    }
  }, [contactInfo, setCompanyInfo]);

  const textColor = theme === "dark" ? "text-gray-200" : "text-black";
  const listTextColor = theme === "dark" ? "text-gray-300" : "text-gray-700";

  // Get arrays from translations
  const infoItems = t("introduction_pages.profile.sections.info.items", {
    returnObjects: true,
  }) as string[];
  const fieldItems = t("introduction_pages.profile.sections.fields.items", {
    returnObjects: true,
  }) as string[];

  // Helper to check if HTML has actual content (not just empty tags)
  const hasContent = (html: string | undefined | null): boolean => {
    if (!html) return false;
    const stripped = html.replace(/<[^>]*>/g, "").trim();
    return stripped.length > 0;
  };

  return (
    <IntroPageLayout
      titleKey="introduction_pages.profile.title"
      contentKey="introduction_pages.profile.subtitle"
    >
      <div className="mt-8 space-y-10">
        {/* If API has profileIntro, show it; otherwise show default sections */}
        {hasContent(companyInfo?.profileIntro) ? (
          <div
            className="ql-snow ql-editor max-w-none"
            dangerouslySetInnerHTML={{ __html: companyInfo!.profileIntro! }}
          />
        ) : (
          <>
            {/* Section 1: General Info */}
            <section>
              <h3 className="text-xl font-bold text-accent-red mb-4">
                {t("introduction_pages.profile.sections.info.title")}
              </h3>
              <ul className={`list-disc pl-5 space-y-2 ${listTextColor}`}>
                {Array.isArray(infoItems) &&
                  infoItems.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </section>

            {/* Section 2: Main Activities */}
            <section>
              <h3 className="text-xl font-bold text-accent-red mb-4">
                {t("introduction_pages.profile.sections.fields.title")}
              </h3>
              <p className={`mb-4 ${textColor}`}>
                {t("introduction_pages.profile.sections.fields.description")}
              </p>
              <ul className={`list-disc pl-5 space-y-2 ${listTextColor}`}>
                {Array.isArray(fieldItems) &&
                  fieldItems.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </section>

            {/* Section 3: Production Capacity */}
            <section>
              <h3 className="text-xl font-bold text-accent-red mb-4">
                {t("introduction_pages.profile.sections.capacity.title")}
              </h3>
              <p className={textColor}>
                {t("introduction_pages.profile.sections.capacity.content")}
              </p>
            </section>

            {/* Section 4: Quality Commitment */}
            <section>
              <h3 className="text-xl font-bold text-accent-red mb-4">
                {t("introduction_pages.profile.sections.quality.title")}
              </h3>
              <p className={textColor}>
                {t("introduction_pages.profile.sections.quality.content")}
              </p>
            </section>

            {/* Section 5: Development Direction */}
            <section>
              <h3 className="text-xl font-bold text-accent-red mb-4">
                {t("introduction_pages.profile.sections.development.title")}
              </h3>
              <p className={textColor}>
                {t("introduction_pages.profile.sections.development.content")}
              </p>
            </section>
          </>
        )}
      </div>
    </IntroPageLayout>
  );
};
