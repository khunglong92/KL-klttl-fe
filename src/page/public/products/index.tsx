import ProductsListComponent from "@/components/public/products/components";
import { SEO } from "@/components/public/common/SEO";
import { useTranslation } from "react-i18next";

export default function ProductsPage() {
  const { t } = useTranslation();
  return (
    <>
      <SEO title={t("nav.products")} description={t("products.description")} />
      <ProductsListComponent />
    </>
  );
}
