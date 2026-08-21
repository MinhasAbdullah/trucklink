import api from "./client";

export const operationsApi = {
  getLoads: () => api.get("/loads/"),
  getLoad: (id) => api.get(`/loads/${id}/`),
  createLoad: (payload) => api.post("/loads/", payload),
  updateLoad: (id, payload) => api.patch(`/loads/${id}/`, payload),
  deleteLoad: (id) => api.delete(`/loads/${id}/`),
  getLoadMatches: (id, minScore = 40) =>
    api.get(`/loads/${id}/matches/`, { params: { min_score: minScore } }),

  getTrucks: () => api.get("/trucks/"),
  getTruck: (id) => api.get(`/trucks/${id}/`),
  createTruck: (payload) => api.post("/trucks/", payload),
  updateTruck: (id, payload) => api.patch(`/trucks/${id}/`, payload),
  deleteTruck: (id) => api.delete(`/trucks/${id}/`),
  getTruckMatches: (id, minScore = 40) =>
    api.get(`/trucks/${id}/matches/`, { params: { min_score: minScore } }),

  getMatches: () => api.get("/matches/"),
  getMatch: (id) => api.get(`/matches/${id}/`),
  findMatches: (payload) => api.post("/matching/find-matches/", payload),
  acceptMatch: (matchId) => api.post("/matching/accept/", { match_id: matchId }),

  getStats: () => api.get("/stats/"),

  uploadFile: (file, folder = "trucklink_docs") => {
    const data = new FormData();
    data.append("file", file);
    data.append("folder", folder);
    return api.post("/upload/cloudinary/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getUploadSignature: (params = {}) => api.post("/upload/signature/", { params }),
};

export const EQUIPMENT_CHOICES = ["Dry Van", "Reefer", "Flatbed", "Stepdeck", "Box Truck"];
export const LOAD_STATUS_CHOICES = ["OPEN", "MATCHED", "IN_TRANSIT", "COMPLETED", "CANCELLED"];
export const TRUCK_STATUS_CHOICES = ["AVAILABLE", "BOOKED", "MAINTENANCE"];
