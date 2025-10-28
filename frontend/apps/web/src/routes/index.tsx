import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MailIcon, LockIcon } from "../components/icons";
import React from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/")({
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password_hash: password,
          device_id: localStorage.getItem("deviceId") || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("refresh_token", data.refresh_token);
        toast.success("Login successful!");
        navigate({ to: "/dashboard" });
      } else {
        toast.error(data.message || "An error occurred during login.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
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
            Welcome back!
          </h2>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
            Let's manage your savings.
          </p>
        </header>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 bg-white p-3.5 pr-10 text-zinc-900  shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                <MailIcon className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 bg-white p-3.5 pr-10 text-zinc-900 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
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
              {loading ? "Logging In..." : "Log In"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          New to Jambo?{" "}
          <a
            href="/register"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
