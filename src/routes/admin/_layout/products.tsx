import { createFileRoute } from "@tanstack/react-router";
import AdminProduct from "@/page/admin/dashboard/product";

export const Route = createFileRoute("/admin/_layout/products")({
  component: AdminProduct,
});
