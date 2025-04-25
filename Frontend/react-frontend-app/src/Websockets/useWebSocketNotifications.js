import { useState, useEffect } from "react";
import useUserStore from "../Stores/useUserStore";
import handleNotification from "../Handles/handleNotification";
import { useIntl } from "react-intl";

function useWebSocketNotifications(isAuthenticated) {
    const token = useUserStore((state) => state.token);
    const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/notifications/";
    const [notificationCount, setNotificationCount] = useState(0);
    const [websocket, setWebSocket] = useState(null);
    const intl = useIntl();
  
    useEffect(() => {
      if (isAuthenticated && token) {
        const ws = new WebSocket(WS_URL);
  
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "AUTHENTICATION", token }));
        };
  
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "NOTIFICATION_COUNT") {
            console.log(data);
            setNotificationCount(data.count); // Update notification count dynamically
          }
          if (data.type === "MESSAGE") {
            handleNotification(intl, "success", "wsNotificationsUnreadMessages", {
                numMessages: data.messageCount,
                username: data.senderUsername
            });
        }
          if(data.type === "PRODUCT_ALTERED") {
            handleNotification(intl, "info", "wsNotificationsProductAltered", {
              username: data.senderUsername
            });
          }
          if(data.type === "PRODUCT_BOUGHT") {
            handleNotification(intl, "success", "wsNotificationsProductBought", {
              username: data.senderUsername
            });
          }
          if (data.type === "PING") {
            ws.send(JSON.stringify({ type: "PONG" }));
          }
        };
  
        setWebSocket(ws);
  
        return () => ws.close(); // Cleanup when unmounted
      }
    }, [isAuthenticated, token]);
  
    return { notificationCount, websocket };
  }
  
  export default useWebSocketNotifications;
  