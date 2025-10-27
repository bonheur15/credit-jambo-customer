import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Welcome to your dashboard.
        </p>
      </div>
    </div>
  );
}