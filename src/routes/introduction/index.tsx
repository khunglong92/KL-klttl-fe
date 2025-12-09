import { createFileRoute } from "@tanstack/react-router";
import IntroductionPage from "@/page/public/introduction";

export const Route = createFileRoute("/introduction/")({
  component: IntroductionPage,
});
