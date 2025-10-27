import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/device-not-approved")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-white p-6 font-sans dark:bg-zinc-900">
      <div className="flex grow flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <header>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
              Jambo
            </h1>
            <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Device Approval Pending
            </h2>

            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              Your device is currently awaiting approval from our team. This
              usually takes up to 24 hours.
            </p>
          </header>

          <div className="mt-8 space-y-4">
            <a href="/" className="mb-2.5relative h-fit block">
              <button
                type="button"
                className="flex w-full justify-center rounded-lg bg-green-500 py-3.5 text-base font-medium text-white shadow-sm transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                Log In to Another Account
              </button>
            </a>
            <a
              href="#"
              className="block text-sm font-medium text-zinc-600 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <footer className="w-full pb-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You will be notified once your device is approved.
        </p>
      </footer>
    </div>
  );
}
