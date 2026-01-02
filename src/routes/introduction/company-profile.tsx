import { createFileRoute } from "@tanstack/react-router";
import CompanyProfilePage from "@/page/public/introduction/company-profile";

export const Route = createFileRoute("/introduction/company-profile")({
  component: CompanyProfilePage,
});
