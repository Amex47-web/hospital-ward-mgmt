import axiosClient from './axiosClient';

export const wardApi = {
  list: () => axiosClient.get('/wards'),
  get: (wardId) => axiosClient.get(`/wards/${wardId}`),
  create: (data) => axiosClient.post('/wards', data),
  update: (wardId, data) => axiosClient.put(`/wards/${wardId}`, data),
  delete: (wardId) => axiosClient.delete(`/wards/${wardId}`),
};
