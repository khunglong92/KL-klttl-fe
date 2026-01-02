import { createFileRoute } from "@tanstack/react-router";
import PartnersPage from "@/page/public/introduction/partners";

export const Route = createFileRoute("/introduction/partners")({
  component: PartnersPage,
});
