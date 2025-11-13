// src/api/property.js
import api from "./api";

// 🏘 Get all properties
export const getAllProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

// 🏠 Add property
export const addProperty = async (data) => {
  const res = await api.post("/properties", data);
  return res.data;
};

// ✏️ Update property
export const updateProperty = async (id, data) => {
  const res = await api.put(`/properties/${id}`, data);
  return res.data;
};

// ❌ Delete property
export const deleteProperty = async (id) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
};

// 🔍 Get property by ID
export const getPropertyById = async (id) => {
  const res = await api.get(`/properties/${id}`);
  return res.data;
};
