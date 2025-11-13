// src/api/appointment.js
import api from "./api";

export const requestAppointment = async (payload) => {
  // payload: { propertyId, userId?, dateTime?, location? }
  const res = await api.post("/appointments", payload);
  return res.data;
};

// ✅ Fetch all tenant requests / appointments
export const fetchRequests = async () => {
  const res = await api.get("/appointments");
  return res.data;
};

// ✅ Approve request by ID
export const approveRequest = async (id) => {
  const res = await api.put(`/appointments/${id}/respond`, null, {
    params: { accepted: true },
  });
  return res.data;
};

// ✅ Reject request by ID
export const rejectRequest = async (id) => {
  const res = await api.put(`/appointments/${id}/respond`, null, {
    params: { accepted: false },
  });
  return res.data;
};

// ✅ Delete appointment
export const deleteAppointment = async (id) => {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
};
