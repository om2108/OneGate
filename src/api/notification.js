import API from "./api";

// Get all notifications
export const getNotifications = () =>
  API.get("/notifications").then(res => res.data);

// Mark as read
export const markNotificationRead = (id) =>
  API.put(`/notifications/${id}/read`).then(res => res.data);
