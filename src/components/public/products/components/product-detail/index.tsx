import { useParams, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { useProductDetail } from "../../hooks/use-product-detail";
import { ProductGallery } from "./components/product-gallery";
import { ProductInfo } from "./components/product-info";
import { ProductReviews } from "./components/product-reviews";
import { RelatedProducts } from "./components/related-products";
import { DetailedDescription } from "./components/detailed-description";
import DetailProductSkeleton from "./components/detail-product-skeleton";
import DetailProductNotFound from "./components/detail-product-not-found";
import DetailProductError from "./components/detail-product-error";
import { ProductCategoriesSidebar } from "@/components/public/introduction/sidebar/product-categories-sidebar";
import { OnlineSupportSidebar } from "@/components/public/introduction/sidebar/online-support-sidebar";
import { FeaturedNewsSidebar } from "@/components/public/introduction/sidebar/featured-news-sidebar-2";
import { FeaturedRecruitmentSidebar } from "@/components/public/introduction/sidebar/featured-recruitment-sidebar";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeaturedServicesSidebar } from "@/components/public/introduction/sidebar/featured-services-sidebar";
import { SEO } from "@/components/public/common/SEO";

export default function ProductDetail() {
  const { t } = useTranslation();
  const { theme } = useTheme();
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

  // Prepare product data for ProductInfo component
  const productInfoData = {
    id: String(product.id),
    name: product.name,
    category: product.category,
    price: product.price,
    showPrice: product.showPrice,
    description: Array.isArray(product.description)
      ? product.description.join("\n")
      : product.description || "",
    isFeatured: product.isFeatured,
  };

  return (
    <>
      <SEO
        title={product.name}
        description={productInfoData.description?.slice(0, 160)}
        keywords={`${product.name}, ${product.category?.name || "sản phẩm"}, gia công kim loại, Thiên Lộc`}
        ogType="product"
        ogImage={product.images?.[0]}
        product={{
          name: product.name,
          description: productInfoData.description,
          image: product.images?.[0],
          category: product.category?.name,
          brand: "Thiên Lộc",
          sku: `TL-${product.id}`,
          availability: "InStock",
        }}
        breadcrumbs={[
          { name: "Trang chủ", url: "/" },
          { name: "Sản phẩm", url: "/products" },
          ...(product.category
            ? [
                {
                  name: product.category.name,
                  url: `/products?categoryId=${product.category.id}`,
                },
              ]
            : []),
          { name: product.name, url: `/products/${product.id}` },
        ]}
      />
      <div
        className={cn(
          "min-h-screen",
          theme === "dark" ? "bg-navy-950" : "bg-[#f8f9fa]",
        )}
      >
        {/* Breadcrumb */}
        <div
          className={cn(
            "border-b py-3",
            theme === "dark"
              ? "bg-navy-900 border-navy-700"
              : "bg-gray-100/80 border-gray-200",
          )}
        >
          <div className="container mx-auto px-4">
            <nav
              className={cn(
                "flex items-center gap-2 text-sm",
                theme === "dark" ? "text-gray-400" : "text-[#CF0927]",
              )}
            >
              <Link to="/" className="flex items-center gap-1 hover:opacity-80">
                <Home className="h-3.5 w-3.5" />
                {t("nav.home", "Trang chủ")}
              </Link>
              <span>»</span>
              <Link to="/products" className="hover:opacity-80">
                {t("nav.products", "Sản phẩm")}
              </Link>
              {product.category && (
                <>
                  <span>»</span>
                  <Link
                    to="/products"
                    search={{ categoryId: product.category.id }}
                    className="hover:opacity-80"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <span>»</span>
              <span
                className={cn(
                  "font-medium line-clamp-1 max-w-[200px]",
                  theme === "dark" ? "text-gray-300" : "text-gray-600",
                )}
              >
                {product.name}
              </span>
            </nav>
          </div>
        </div>
        {/* Main Content with Sidebar */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <aside className="w-full lg:w-[280px] shrink-0 space-y-4 order-2 lg:order-1">
                <ProductCategoriesSidebar showAllOption={true} />
                <FeaturedServicesSidebar />
                <FeaturedNewsSidebar />
                <FeaturedRecruitmentSidebar />
                <OnlineSupportSidebar />
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0 order-1 lg:order-2">
                {/* Product Header */}
                <div
                  className={cn(
                    "rounded-lg p-4 md:p-6 mb-6 border shadow-sm",
                    theme === "dark"
                      ? "bg-navy-900 border-navy-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  {/* Product Title */}

                  {/* Gallery & Info Grid */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <ProductGallery images={product.images || []} />
                    <ProductInfo product={productInfoData} />
                  </div>
                </div>

                {/* Detailed Description - Fetched from URL */}
                {product.detailedDescription && (
                  <div
                    className={cn(
                      "rounded-lg p-6 mb-6 border shadow-sm",
                      theme === "dark"
                        ? "bg-navy-900 border-navy-700"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <DetailedDescription
                      url={product.detailedDescription}
                      title={t(
                        "productDetail.detailed.title",
                        "Mô tả chi tiết",
                      )}
                    />
                  </div>
                )}

                {/* Reviews Section */}
                <div
                  className={cn(
                    "rounded-lg p-6 mb-6 border shadow-sm",
                    theme === "dark"
                      ? "bg-navy-900 border-navy-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  <ProductReviews
                    productId={String(product.id)}
                    productName={product.name}
                  />
                </div>

                {/* Related Products */}
                <div
                  className={cn(
                    "rounded-lg p-6 border shadow-sm",
                    theme === "dark"
                      ? "bg-navy-900 border-navy-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  <RelatedProducts categoryId={product.category?.id} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
