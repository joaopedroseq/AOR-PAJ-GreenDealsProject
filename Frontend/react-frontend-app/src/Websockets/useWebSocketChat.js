import { useState, useEffect } from "react";
import useUserStore from "../Stores/useUserStore";

function useWebSocketChat() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const token = useUserStore((state) => state.token);
  const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/chat/";
  const [websocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      const ws = new WebSocket(WS_URL);
      ws.onopen = function (event) {
        let authMessage = JSON.stringify({
          type: "AUTHENTICATION",
          token: token,
        });
        ws.send(authMessage);
      };

      ws.onmessage = function (event) {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "MESSAGE":
            console.log(
              "New message from",
              data.sender,
              ":",
              data.message,
              ":",
              data.timestamp
            );
            break;
          case "AUTHENTICATED":
            break;
          case "PING":
            ws.send(JSON.stringify({ type: "PONG" })); // Respond to keep the connection alive
            break;
          default:
            console.warn("Unknown message type:", data.type);
        }
      };

      setWebSocket(ws);

      return () => {
        ws.close(); // Cleanup connection on unmount
      };
    }
  }, [token, isAuthenticated]);

  const sendMessage = (username, message) => {
    if (websocket) {
      const payload = JSON.stringify({
        type: "MESSAGE",
        recipient: username,
        message: message,
      });
      websocket.send(payload);
      console.log("Message sent:", payload);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return { sendMessage };
}

export default useWebSocketChat;
