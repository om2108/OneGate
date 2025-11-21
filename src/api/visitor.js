// src/api/visitor.js
import api from "./api";

// For secretary dashboard: visitors by society + optional userIds
export const getVisitors = async (societyId, userIds = []) =>
  (await api.get("/visitors", {
    params: { societyId, userIds },
    paramsSerializer: (params) => {
      const usp = new URLSearchParams();
      usp.set("societyId", params.societyId);
      (params.userIds || []).forEach((id) => usp.append("userIds", id));
      return usp.toString();
    },
  })).data;

export const addVisitor = async (data) =>
  (await api.post("/visitors", data)).data;

export const updateVisitorStatus = async (id, status) =>
  (await api.put(`/visitors/${id}/status`, null, { params: { status } })).data;

export const deleteVisitor = async (id) =>
  (await api.delete(`/visitors/${id}`)).data;
