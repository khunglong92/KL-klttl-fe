import ServicesDetailPage from "@/page/public/services/detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services/$id")({
  component: ServicesDetailPage,
});
