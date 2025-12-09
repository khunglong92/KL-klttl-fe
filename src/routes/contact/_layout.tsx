import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact/_layout")({
  component: () => <Outlet />,
});
