import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/page/public/products/detail";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});
