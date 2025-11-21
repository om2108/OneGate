// src/api/society.js
import api from "./api";

export const getAllSocieties = async () =>
  (await api.get("/societies")).data;

export const getSocietyById = async (id) =>
  (await api.get(`/societies/${id}`)).data;

export const createSociety = async (data) =>
  (await api.post("/societies", data)).data;

export const updateSociety = async (id, data) =>
  (await api.put(`/societies/${id}`, data)).data;

export const deleteSociety = async (id) =>
  (await api.delete(`/societies/${id}`)).data;
