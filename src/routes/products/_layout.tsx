import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/_layout")({
  component: Outlet,
});
