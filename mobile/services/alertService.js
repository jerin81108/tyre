// services/alertService.js
import api from './api';

export const getAllAlerts = async () => {
  const res = await api.get('/alerts');
  return res.data;
};

export const markAlertAsRead = async (id) => {
  const res = await api.put(`/alerts/${id}/read`);
  return res.data;
};

export const resolveAlert = async (id) => {
  const res = await api.put(`/alerts/${id}/resolve`);
  return res.data;
};
