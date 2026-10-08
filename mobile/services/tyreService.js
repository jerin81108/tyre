// services/tyreService.js
import api from './api';

export const getAllTyres = async () => {
  const res = await api.get('/tyres');
  return res.data;
};

export const getTyreById = async (id) => {
  const res = await api.get(`/tyres/${id}`);
  return res.data;
};

export const getTyresByDumper = async (dumperId) => {
  const res = await api.get('/tyres');
  const all = res.data.data || [];
  return { success: true, data: all.filter(t => t.dumperId === dumperId) };
};

export const createTyre = async (data) => {
  const res = await api.post('/tyres', data);
  return res.data;
};

export const updateTyre = async (id, data) => {
  const res = await api.put(`/tyres/${id}`, data);
  return res.data;
};

export const updateTyrePressure = async (id, pressure) => {
  const res = await api.put(`/tyres/${id}/pressure`, { pressure });
  return res.data;
};
