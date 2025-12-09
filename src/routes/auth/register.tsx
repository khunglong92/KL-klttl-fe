import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Register</h1>
      <p>Registration form will go here.</p>
    </div>
  );
}

