import { createFileRoute } from "@tanstack/react-router";
import Quote from "@/page/public/quote";

export const Route = createFileRoute("/quote/")({
  component: Quote,
});
