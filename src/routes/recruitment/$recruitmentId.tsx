import RecruitmentDetailPage from "@/page/public/recruitment/detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recruitment/$recruitmentId")({
  component: RecruitmentDetailPage,
});
