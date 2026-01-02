import { createFileRoute } from "@tanstack/react-router";
import ProjectsListPage from "@/page/public/project";

export const Route = createFileRoute("/projects/")({
  component: ProjectsListPage,
});
