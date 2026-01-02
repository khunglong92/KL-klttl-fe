import { createFileRoute } from "@tanstack/react-router";
import AdminReviews from "@/page/admin/dashboard/reviews";

export const Route = createFileRoute("/admin/_layout/reviews")({
  component: AdminReviews,
});
