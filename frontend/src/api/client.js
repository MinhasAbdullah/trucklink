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

export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (data.error) return data.error;

  const firstField = Object.keys(data)[0];
  if (firstField) {
    const value = data[firstField];
    const message = Array.isArray(value) ? value[0] : value;
    return `${firstField}: ${message}`;
  }

  return fallback;
};

export default api;
