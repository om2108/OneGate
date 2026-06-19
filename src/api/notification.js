import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");

  return res.data;
};

export const getNotificationCount = async () => {
  const res = await api.get("/notifications/count");

  return res.data;
};

export const markNotificationRead = async (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  return api.put("/notifications/read-all");
};

export const sendNotification = async (userId, message) => {
  if (!message) return;

  return api.post(
    "/notifications/send",

    null,

    {
      params: {
        userId,

        message,
      },
    },
  );
};
