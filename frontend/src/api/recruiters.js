import api from "./client";

export const recruiterApi = {
  createProfile: (payload) => api.post("/recruiters/profile/", payload),
  getMyProfile: () => api.get("/recruiters/profile/me/"),
  getMyJobs: () => api.get("/recruiters/jobs/mine/"),
  createJob: (payload) => api.post("/recruiters/jobs/", payload),
};
