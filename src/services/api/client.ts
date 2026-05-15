import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach access token AND cartId ──────────────────────────────────
client.interceptors.request.use((config) => {
  // ✅ ADD AUTHORIZATION HEADER FOR AUTHENTICATED USERS
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.debug(`[API] Authorization header added`);
  } else {
    // ✅ FOR GUESTS: Add cartId to header
    const cartId = localStorage.getItem("cartId");
    if (cartId) {
      config.headers["X-Cart-ID"] = cartId;
      console.debug(`[API] Request X-Cart-ID header: ${cartId}`);
    }
  }

  return config;
});

// ── Token refresh state ───────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

// ── Response: handle token errors & capture cartId ──────────────────────────
client.interceptors.response.use(
  (response) => {
    // ✅ CAPTURE CARTID FROM RESPONSE HEADER (for guests)
    const cartId = response.headers["x-cart-id"];
    if (cartId && !localStorage.getItem("accessToken")) {
      // Only save cartId for guests (unauthenticated users)
      localStorage.setItem("cartId", cartId);
      console.debug(`[API] Saved guest cartId from response: ${cartId}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorCode = error.response?.data?.error;

    // Only intercept token errors, pass everything else through
    if (errorCode !== "TOKEN_EXPIRED" && errorCode !== "INVALID_TOKEN") {
      return Promise.reject(error);
    }

    // Refresh itself failed → logout
    if (originalRequest._isRetry) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // Queue concurrent requests while refresh is in progress
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(client(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._isRetry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/auth/refresh-token`,
        { refreshToken },
      );

      const { accessToken, refreshToken: newRefreshToken } = data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      useAuthStore.setState({ accessToken, refreshToken: newRefreshToken });
      client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return client(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default client;