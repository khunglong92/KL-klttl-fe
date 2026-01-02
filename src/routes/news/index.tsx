import { createFileRoute } from "@tanstack/react-router";
import NewsListPage from "@/page/public/news";

export const Route = createFileRoute("/news/")({
  component: NewsListPage,
});
