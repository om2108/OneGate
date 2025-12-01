// src/api/event.js
import api from "./api";

export const getEvents = async () => (await api.get("/events")).data;

export const createEvent = async (data) =>
  (await api.post("/events", data)).data;

export const updateEvent = async (id, data) =>
  (await api.put(`/events/${id}`, data)).data;

export const deleteEvent = async (id) =>
  (await api.delete(`/events/${id}`)).data;

