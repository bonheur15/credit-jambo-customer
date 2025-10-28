import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await fetch(`${API_URL}users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("jwt", data.jwt);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data.jwt;
  } else {
    throw new Error("Failed to refresh token");
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("jwt");

  if (!token) {
    // This case should ideally be handled by route protection
    // and not happen in API calls.
    window.location.href = "/login";
    throw new Error("No token found");
  }

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    try {
      const newToken = await refreshToken();
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, options); // Retry the request with the new token
    } catch (error) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("jwt");
      localStorage.removeItem("refresh_token");
      window.location.href = "/register";
      throw new Error("Session expired");
    }
  }

  return response;
};
