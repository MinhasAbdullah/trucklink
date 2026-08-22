import api from "./client";

export const adminApi = {
  getModerationQueue: () => api.get("/drivers/moderation/queue/"),
  moderateDriver: (driverId, payload) =>
    api.post(`/drivers/moderation/${driverId}/`, payload),
  getAnalytics: () => api.get("/analytics/"),
  getRecruiters: () => api.get("/recruiters/admin/list/"),
  updateRecruiterStatus: (recruiterId, status) =>
    api.post(`/recruiters/admin/${recruiterId}/status/`, { status }),
};
