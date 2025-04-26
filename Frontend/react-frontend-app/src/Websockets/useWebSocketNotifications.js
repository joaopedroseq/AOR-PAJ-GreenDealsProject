import { useState, useEffect, useRef } from "react";
import useUserStore from "../Stores/useUserStore";
import handleNotification from "../Handles/handleNotification";
import { useIntl } from "react-intl";
import { transformArrayDatetoDate, dateToFormattedTime } from "../Utils/utilityFunctions";

function useWebSocketNotifications(isAuthenticated) {
    const token = useUserStore((state) => state.token);
    const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/notifications/";
    const [notificationCount, setNotificationCount] = useState(0);
    const [websocket, setWebSocket] = useState(null);
    const intl = useIntl();
    const currentIntlRef = useRef(intl); // Store latest intl value in a ref
    

    useEffect(() => {
        // Prevent WebSocket from being recreated if already connected
        if (!isAuthenticated || !token || websocket) {
          return;
        }
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "AUTHENTICATION", token }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "NOTIFICATION_COUNT") {
                setNotificationCount(data.count);
            }
            if (data.type === "MESSAGE") {
              let notification = data.notification;
              let timestamp = transformArrayDatetoDate(notification.timestamp);
              timestamp = dateToFormattedTime(timestamp);
              console.log(notification);
                handleNotification(currentIntlRef.current, "success", "wsNotificationsLastMessage", {
                    sender: notification.senderUsername,
                    message: notification.content,
                    timestamp: timestamp
                });
                handleNotification(currentIntlRef.current, "success", "wsNotificationsUnreadMessages", {
                  numMessages: notification.messageCount,
                  sender: notification.senderUsername
              });
            }
            if (data.type === "PRODUCT_ALTERED") {
                handleNotification(currentIntlRef.current, "info", "wsNotificationsProductAltered", {
                    username: data.senderUsername
                });
            }
            if (data.type === "PRODUCT_BOUGHT") {
                handleNotification(currentIntlRef.current, "success", "wsNotificationsProductBought", {
                    username: data.senderUsername
                });
            }
            if (data.type === "PING") {
                ws.send(JSON.stringify({ type: "PONG" }));
            }
        };

        ws.onclose = () => {
            console.log("WebSocket closed.");
            setWebSocket(null);
        };

        setWebSocket(ws); // Persist the WebSocket instance

        return () => {
            console.log("Cleaning up WebSocket...");
            ws.close();
        };
    }, [isAuthenticated, token]); // Dependencies

    useEffect(() => {
      currentIntlRef.current = intl; // Update the ref dynamically
      console.log("Updated locale:", currentIntlRef.current);
  }, [intl]); // Run this effect whenever `intl` changes

    return { notificationCount, websocket };

    
}

export default useWebSocketNotifications;