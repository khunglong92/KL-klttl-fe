import RecruitmentListPage from "@/page/public/recruitment";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recruitment/")({
  component: RecruitmentListPage,
});
