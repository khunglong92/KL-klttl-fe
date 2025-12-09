import { ProductCard } from "./product-card";
import { ProductCardProps } from "..";

interface ProductListItemProps {
  products: ProductCardProps[];
}

export function ProductListItem({ products }: ProductListItemProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} {...product} index={index} />
      ))}
    </div>
  );
}

