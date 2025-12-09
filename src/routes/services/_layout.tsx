import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/services/_layout")({
  component: () => <Outlet />,
});
