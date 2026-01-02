import { AdminRecruitmentPage } from "@/components/admin/recruitment";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/recruitment")({
  component: AdminRecruitmentPage,
});
