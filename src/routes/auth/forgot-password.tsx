import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordComponent,
});

function ForgotPasswordComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Forgot Password</h1>
      <p>Forgot password form will go here.</p>
    </div>
  );
}

