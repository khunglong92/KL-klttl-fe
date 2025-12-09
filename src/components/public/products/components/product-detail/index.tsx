import { useParams, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useProductDetail } from "../../hooks/use-product-detail";
import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";
import { ProductTabs } from "./components/product-tabs";
import { RelatedProducts } from "./components/related-products";
import DetailProductSkeleton from "./components/detail-product-skeleton";
import DetailProductNotFound from "./components/detail-product-not-found";
import DetailProductError from "./components/detail-product-error";
import { ChevronRight, Home } from "lucide-react";

export default function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams({ from: "/products/$id" });
  const { product, loading, error } = useProductDetail(id);

  if (loading) {
    return <DetailProductSkeleton />;
  }

  if (error) {
    return <DetailProductError t={t} error={error} />;
  }

  if (!product) {
    return <DetailProductNotFound t={t} />;
  }

  // Safely access nested data - no type casting needed as types match from API
  const descriptionData = product.description ?? null;
  const technicalSpecs = product.technicalSpecs ?? null;
  const warrantyPolicy = product.warrantyPolicy ?? null;

  // Prepare product data for ProductInfo component
  const productInfoData = {
    id: String(product.id),
    name: product.name,
    category: product.category,
    price: product.price,
    description: descriptionData?.overview || "", // Use overview for the short description
    isFeatured: product.isFeatured,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Link
          to="/"
          className="hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
        >
          <Home className="h-4 w-4" />
          {t("breadcrumb.home", "Trang chủ")}
        </Link>
        <span>
          <ChevronRight className="h-4 w-4" />
        </span>
        <Link
          to="/products"
          className="hover:text-gray-900 dark:hover:text-white"
        >
          {t("breadcrumb.products", "Sản phẩm")}
        </Link>
        {product.category && (
          <>
            <span>
              <ChevronRight className="h-4 w-4" />
            </span>
            <Link
              to="/products"
              search={{ category: product.category.id }}
              className="hover:text-gray-900 dark:hover:text-white"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>
          <ChevronRight className="h-4 w-4" />
        </span>
        <span className="text-gray-900 dark:text-white font-semibold">
          {product.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images || []} />
        <ProductInfo product={productInfoData} />
      </div>

      {/* Tabs Section - Now includes specs and warranty */}
      <ProductTabs
        description={descriptionData}
        technicalSpecs={
          technicalSpecs as Record<string, string | undefined> | null
        }
        warrantyPolicy={warrantyPolicy}
      />

      {/* Related Products */}
      <RelatedProducts categoryId={product.category?.id} />
    </div>
  );
}
