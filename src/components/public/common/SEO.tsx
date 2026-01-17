import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface ProductSchema {
  name: string;
  description?: string;
  image?: string;
  price?: string;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
  sku?: string;
  category?: string;
}

interface ArticleSchema {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  keywords?: string;
  noIndex?: boolean;
  // Structured data props
  product?: ProductSchema;
  article?: ArticleSchema;
  breadcrumbs?: BreadcrumbItem[];
}

const SITE_URL = "https://kimloaitamthienloc.vn";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  keywords,
  noIndex = false,
  product,
  article,
  breadcrumbs,
}: SEOProps) => {
  const { t } = useTranslation();
  const siteName = t("nav.companyName") || "Thiên Lộc";

  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - Sản xuất & Gia công Kim loại Tấm`;
  const siteDescription =
    description ||
    t("nav.companyDescription") ||
    "Chuyên gia công cắt laser CNC, chấn CNC, đột CNC, sơn tĩnh điện. Sản xuất tủ locker, xe đẩy, thiết bị công nghiệp.";

  const url =
    canonical ||
    (typeof window !== "undefined" ? window.location.href : SITE_URL);
  const image = ogImage || DEFAULT_OG_IMAGE;

  const defaultKeywords =
    "gia công kim loại tấm, cắt laser CNC, chấn CNC, đột CNC, sơn tĩnh điện, tủ locker, xe đẩy inox, thiết bị công nghiệp, Thiên Lộc, Hà Nội";
  const fullKeywords = keywords
    ? `${keywords}, ${defaultKeywords}`
    : defaultKeywords;

  // Generate Product structured data
  const generateProductSchema = (p: ProductSchema) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.image,
    brand: {
      "@type": "Brand",
      name: p.brand || siteName,
    },
    sku: p.sku,
    category: p.category,
    ...(p.price && {
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: p.currency || "VND",
        availability: `https://schema.org/${p.availability || "InStock"}`,
        seller: {
          "@type": "Organization",
          name: siteName,
        },
      },
    }),
  });

  // Generate Article structured data
  const generateArticleSchema = (a: ArticleSchema) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: {
      "@type": "Organization",
      name: a.author || siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  });

  // Generate Breadcrumb structured data
  const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  });

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <html lang="vi" />
      <title>{fullTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={url} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={image} />

      {/* Product structured data */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify(generateProductSchema(product))}
        </script>
      )}

      {/* Article structured data */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify(generateArticleSchema(article))}
        </script>
      )}

      {/* Breadcrumb structured data */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
