import { createFileRoute } from "@tanstack/react-router";
import Product from "@/page/public/products";

export const Route = createFileRoute("/products/")({
  component: Product,
});
