import { createFileRoute } from "@tanstack/react-router";
import ProjectPublicPage from "@/page/public/project";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectPublicPage,
});
