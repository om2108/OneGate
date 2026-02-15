import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ✅ Do NOT attach token for auth public routes
  const isPublicAuthRoute =
    config.url?.includes("/auth/register") ||
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/verify-otp") ||
    config.url?.includes("/auth/resend") ||
    config.url?.includes("/auth/forgot-password") ||
    config.url?.includes("/auth/reset-password");

  if (token && !isPublicAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export default api;
