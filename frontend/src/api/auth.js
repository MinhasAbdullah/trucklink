import api from "./client";

export const authApi = {
  login: (credentials) => api.post("/token/", credentials),
  signup: (role, payload) => api.post(`/users/signup/${role}/`, payload),
};
