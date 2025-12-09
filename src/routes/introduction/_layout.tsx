import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/introduction/_layout")({
  component: () => <Outlet />,
});
