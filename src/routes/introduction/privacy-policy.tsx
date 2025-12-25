import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicyPage from "@/page/public/introduction/privacy-policy";

export const Route = createFileRoute("/introduction/privacy-policy")({
  component: PrivacyPolicyPage,
});
