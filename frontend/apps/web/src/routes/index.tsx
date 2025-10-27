import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const UserIcon = ({ className }: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);


const MailIcon = ({ className }: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);


const LockIcon = ({ className }: {
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function HomeComponent() {
  return (

    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-sm">

        <header className="text-center">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            Jambo
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Join Jambo!
          </h2>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Start saving today.
          </p>
        </header>


        <form className="mt-8 space-y-6">

          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Full Name
            </label>
            <div className="relative mt-2">
              <input
                id="full-name"
                name="full-name"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your full name"
                className="block w-full rounded-lg border border-green-200 bg-white p-3.5 pr-10 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <UserIcon className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>


          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <div className="relative mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="block w-full rounded-lg border border-green-200 bg-white p-3.5 pr-10 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <MailIcon className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>


          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Enter your password"
                className="block w-full rounded-lg border border-green-200 bg-white p-3.5 pr-10 text-zinc-900 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <LockIcon className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>


          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-green-500 py-3.5 text-base font-medium text-white shadow-sm transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              Sign Up
            </button>
          </div>
        </form>


        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{' '}
          <a
            href="#"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
