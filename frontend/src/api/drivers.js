import api from "./client";

export const driverApi = {
  createProfile: (payload) => api.post("/drivers/profile/", payload),
  getMyProfile: () => api.get("/drivers/profile/me/"),
  updateMyProfile: (payload) => api.patch("/drivers/profile/me/", payload),
};
