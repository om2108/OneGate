import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

let client = null;

export const connectSocket = (
  userId,

  onRefresh,
) => {
  if (!userId) return;

  if (client?.connected) return;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

    reconnectDelay: 5000,

    debug: () => {},

    onConnect: () => {
      client.subscribe(
        `/topic/notifications/${userId}`,

        () => {
          window.dispatchEvent(new Event("refreshNotifications"));

          onRefresh?.();
        },
      );
    },
  });

  client.activate();
};

export const disconnectSocket = () => {
  client?.deactivate();

  client = null;
};
