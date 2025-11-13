// src/api/user.js
import api from "./api";

export const getAllUsers = async () => (await api.get("/users")).data;

export const getUserById = async (id) => (await api.get(`/users/${id}`)).data;

export const updateUser = async (id, data) =>
  (await api.put(`/users/${id}`, data)).data;

export const deleteUser = async (id) => (await api.delete(`/users/${id}`)).data;
