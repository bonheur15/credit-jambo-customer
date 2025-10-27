import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/device-not-approved")({
  component: DeviceNotApprovedComponent,
});

function DeviceNotApprovedComponent() {
  const navigate = useNavigate({ from: "/device-not-approved" });
  const [loading, setLoading] = useState(false);

  const checkDeviceVerification = async () => {
    setLoading(true);
    const deviceId = localStorage.getItem("deviceId");
    const jwt = localStorage.getItem("jwt");

    if (!deviceId || !jwt) {
      toast.error("Missing device ID or token. Please register again.");
      navigate({ to: "/register" });
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}device-verifications/${deviceId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.ok) {
        const verificationData = await response.json();
        if (verificationData.status === "VERIFIED") {
          toast.success("Device approved!");
          navigate({ to: "/dashboard" });
        } else {
          toast.info(
            "Device approval is still pending. Please wait and try again."
          );
        }
      } else if (response.status === 404) {
        toast.info(
          "Device approval is still pending. Please wait and try again."
        );
      } else {
        toast.error("Failed to check device verification status.");
      }
    } catch (error) {
      toast.error(
        "An unexpected error occurred while checking device status."
      );
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans dark:bg-zinc-900">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
          Device Not Approved
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Your device is not approved to access this application. Please wait for
          approval and then refresh.
        </p>
        <button
          onClick={checkDeviceVerification}
          disabled={loading}
          className="mt-6 rounded-lg bg-green-500 px-6 py-2 text-base font-medium text-white shadow-sm transition duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-zinc-900"
        >
          {loading ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>
    </div>
  );
}
