import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  keywords,
}: SEOProps) => {
  const { t } = useTranslation();
  const siteName = t("nav.companyName") || "THIEN LOC";

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const siteDescription =
    description ||
    t("nav.companyDescription") ||
    "Manufacture & Metal Processing";
  const url = canonical || window.location.href;
  const image = ogImage || "/og-image.jpg"; // Default OG image

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />

      {/* Open Graph tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
