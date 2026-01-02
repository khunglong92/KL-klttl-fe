import { createFileRoute } from "@tanstack/react-router";
import NewsDetailPage from "@/page/public/news/detail";

export const Route = createFileRoute("/news/$newsId")({
  component: NewsDetailPage,
});
