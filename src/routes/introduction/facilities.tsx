import { createFileRoute } from "@tanstack/react-router";
import FacilitiesPage from "@/page/public/introduction/facilities";

export const Route = createFileRoute("/introduction/facilities")({
  component: FacilitiesPage,
});
