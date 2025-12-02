import { useCallback } from "react";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/api";
import { useSimpleAuthStore } from "../store/simpleAuthStore";

// Hook that returns API helpers - no auth tokens needed
export default function useApi() {
  const router = useRouter();
  const authStore = useSimpleAuthStore();

  const request = useCallback(
    async (path, options = {}) => {
      try {
        const url = `${API_URL}${path}`;
        const headers = {
          "Content-Type": "application/json",
          ...options.headers,
        };

        const config = {
          ...options,
          headers,
        };

        const response = await fetch(url, config);

        // If 401, redirect to login
        if (response.status === 401) {
          authStore.logOut();
          router.replace("/login");
          return null;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "API request failed");
        }

        return data;
      } catch (error) {
        console.log("API Error:", error.message);
        throw error;
      }
    },
    [authStore, router]
  );

  return {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: "DELETE" }),
  };
}
