import AdminCompanyIntros from "@/page/admin/dashboard/company-intros";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/company-intros")({
  component: AdminCompanyIntros,
});
