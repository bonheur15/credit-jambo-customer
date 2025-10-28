import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserIcon, MailIcon, LockIcon } from "../components/icons";
import { useState } from "react";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;
export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});

function RegisterComponent() {
  const navigate = useNavigate({ from: "/register" });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register user
      const registerResponse = await fetch(
        `${import.meta.env.VITE_API_URL}users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName,
            email: email,
            password_hash: password,
          }),
        },
      );

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        toast.error(errorData.message || "Registration failed.");
        return;
      }

      const userData = await registerResponse.json();
      const userId = userData.id;

      // Register device
      const deviceId = crypto.randomUUID();
      const deviceMeta = {
        os: navigator.platform,
        userAgent: navigator.userAgent,
      };

      const deviceResponse = await fetch(
        `${import.meta.env.VITE_API_URL}devices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_id: deviceId,
            device_meta: deviceMeta,
            created_by: "client",
            user_id: userId,
          }),
        },
      );

      if (!deviceResponse.ok) {
        toast.error("Device registration failed.");
        return;
      }

      const deviceData = await deviceResponse.json();
      localStorage.setItem("deviceId", deviceData.id); // Store device ID from response

      // 4. Redirect to device-not-approved
      toast.success(
        "Registration successful! Please wait for device approval.",
      );
      navigate({ to: "/device-not-approved" });
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-green-500 py-3.5 text-base font-medium text-white shadow-sm transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <a
            href="/"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
