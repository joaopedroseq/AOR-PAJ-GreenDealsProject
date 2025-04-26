import { useState, useEffect, useRef } from "react";
import useUserStore from "../Stores/useUserStore";
import useMessageStore from "../Stores/useMessageStore";
import { transformArrayDatetoDate } from "../Utils/utilityFunctions";

function useWebSocketChat() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const token = useUserStore((state) => state.token);
  const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/chat/";
  const [websocket, setWebSocket] = useState(null);
  const { selectedUser, addLocalMessage, isMessageAlreadyInQueue, markConversationAsRead  } = useMessageStore();
  const currentChattingUser = useRef(selectedUser);

  useEffect(() => {
    currentChattingUser.user = selectedUser;
  }, [selectedUser]);

  // Move sendMessage OUTSIDE useEffect
  const sendMessage = (username, message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      const messageJSON = JSON.stringify({
        type: "MESSAGE",
        recipient: username,
        message: message,
      });
      websocket.send(messageJSON);
      console.log("Message sent:", messageJSON);
      return true;
    } else {
      console.error("WebSocket is not connected");
      return false;
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !token || websocket) {
      return;
    }

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "AUTHENTICATION", token }));
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("WebSocket received:", data);

      switch (data.type) {
        case "MESSAGE":
          if(data.sender === currentChattingUser.user.username) {
            if(!isMessageAlreadyInQueue(data.id)) {
              const newMessage = {
                messageId: data.id,
                message: data.message,
                sender: data.sender,
                formattedTimestamp: new Date(data.timestamp),
                status: 'read'
              };
              console.log(newMessage);
              addLocalMessage(newMessage);
            }
          }
          break;
        case "AUTHENTICATED":
          console.log("Authenticated to websocket chat");
          break;
        case "CONVERSATION_READ":
          if(data.sender === currentChattingUser.user.username) {
            markConversationAsRead();
          }
          break;
        case "PING":
          ws.send(JSON.stringify({ type: "PONG" })); // Respond to keep the connection alive
          break;
        default:
          console.warn("Unknown message type:", data.type);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed.");
      setWebSocket(null);
    };

    setWebSocket(ws);

    return () => {
      console.log("Cleaning up WebSocket...");
      ws.close();
    };
  }, [token, isAuthenticated]);

  return { sendMessage };
}

export default useWebSocketChat;