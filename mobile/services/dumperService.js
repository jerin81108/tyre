// services/dumperService.js
import api from './api';

export const getAllDumpers = async () => {
  const res = await api.get('/dumpers');
  return res.data;
};

export const getDumperById = async (id) => {
  const res = await api.get(`/dumpers/${id}`);
  return res.data;
};

export const createDumper = async (data) => {
  const res = await api.post('/dumpers', data);
  return res.data;
};

export const updateDumper = async (id, data) => {
  const res = await api.put(`/dumpers/${id}`, data);
  return res.data;
};
