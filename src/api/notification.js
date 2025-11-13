// src/api/notifications.js
import API from "./api";

// 🟢 Create a new notification
export const createNotification = (data) => 
  API.post("/notifications", data).then((res) => res.data);

// 🟡 Get all notifications for a user
export const getNotifications = (userId) => 
  API.get("/notifications", { params: { userId } }).then((res) => res.data);

// 🔵 Mark a notification as read
export const markNotificationRead = (id) => 
  API.put(`/notifications/${id}/read`).then((res) => res.data);
