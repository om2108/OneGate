// src/api/visitor.js
import api from "./api";

export const getVisitors = async () => (await api.get("/visitors")).data;

export const addVisitor = async (data) =>
  (await api.post("/visitors", data)).data;

export const updateVisitor = async (id, data) =>
  (await api.put(`/visitors/${id}`, data)).data;

export const deleteVisitor = async (id) =>
  (await api.delete(`/visitors/${id}`)).data;
