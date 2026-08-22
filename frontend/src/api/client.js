import axios from "axios";

export const STORAGE_KEYS = {
  access: "trucklink_access_token",
  refresh: "trucklink_refresh_token",
  role: "trucklink_user_role",
  username: "trucklink_username",
};

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({ baseURL });

export const clearStoredAuth = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.access);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refresh);

    if (
      error.response?.status === 401 &&
      refreshToken &&
      originalRequest &&
      !originalRequest._retry &&
      !String(originalRequest.url || "").includes("token/refresh")
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshClient
            .post("/token/refresh/", { refresh: refreshToken })
            .then(({ data }) => {
              localStorage.setItem(STORAGE_KEYS.access, data.access);
              if (data.refresh) {
                localStorage.setItem(STORAGE_KEYS.refresh, data.refresh);
              }
              return data.access;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredAuth();
        window.dispatchEvent(new Event("trucklink:auth-expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  if (!error?.response) {
    return "Unable to connect right now. Check your connection and try again.";
  }
  if (status >= 500) return "We’re having trouble completing your request. Please try again.";
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don’t have permission to perform this action.";
  if (status === 404 && (!data || typeof data === "string")) return fallback;

  if (data && typeof data === "object") {
    if (typeof data.detail === "string" && data.detail.length < 180) return data.detail;
    if (typeof data.error === "string" && data.error.length < 180) return data.error;

    const firstField = Object.keys(data)[0];
    if (firstField) {
      const value = data[firstField];
      const message = Array.isArray(value) ? value[0] : value;
      if (typeof message === "string" && message.length < 180) {
        const label = firstField.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
        return `${label}: ${message}`;
      }
    }
  }

  return fallback;
};

export default api;
