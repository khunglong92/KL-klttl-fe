import { createFileRoute } from "@tanstack/react-router";
import Project from "@/page/public/project";

export const Route = createFileRoute("/projects/")({
  component: Project,
});
