// src/api/complaint.js
import api from "./api";

export const getComplaints = async () => (await api.get("/complaints")).data;

export const getComplaintById = async (id) =>
  (await api.get(`/complaints/${id}`)).data;

export const addComplaint = async (data) =>
  (await api.post("/complaints", data)).data;

export const updateComplaintStatus = async (id, status) =>
  (await api.put(`/complaints/${id}`, { status })).data;

export const deleteComplaint = async (id) =>
  (await api.delete(`/complaints/${id}`)).data;
