import ServicesListPage from "@/page/public/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services/")({
  component: ServicesListPage,
});
