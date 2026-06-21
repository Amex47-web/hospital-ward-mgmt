import axiosClient from './axiosClient';

export const bedApi = {
  listByWard: (wardId) => axiosClient.get(`/wards/${wardId}/beds`),
  get: (bedId) => axiosClient.get(`/beds/${bedId}`),
  create: (wardId, data) => axiosClient.post(`/wards/${wardId}/beds`, data),
  update: (bedId, data) => axiosClient.put(`/beds/${bedId}`, data),
  updateStatus: (bedId, status) => axiosClient.patch(`/beds/${bedId}/status`, { status }),
  delete: (bedId) => axiosClient.delete(`/beds/${bedId}`),
};
