// services/maintenanceService.js
import api from './api';

export const getAllMaintenance = async () => {
  const res = await api.get('/maintenance');
  return res.data;
};

export const createMaintenance = async (data) => {
  const res = await api.post('/maintenance', data);
  return res.data;
};

export const updateMaintenance = async (id, data) => {
  const res = await api.put(`/maintenance/${id}`, data);
  return res.data;
};
