import { createFileRoute } from "@tanstack/react-router";
import Home from "@/page/public/home";

export const Route = createFileRoute("/")({
  component: Home,
});
