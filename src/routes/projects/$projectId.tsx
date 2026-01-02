import ProjectsDetailPage from "@/page/public/project/detail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId")({
  component: ProjectsDetailPage,
});
