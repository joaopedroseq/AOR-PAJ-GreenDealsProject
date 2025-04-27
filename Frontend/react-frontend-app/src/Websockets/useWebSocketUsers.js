import { useState, useEffect } from "react";
import useStatsStore from "../Stores/useStatsStore";

function useWebSocketUsers() {
  const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/users/";
  const [websocket, setWebSocket] = useState(null);

  const handleUpdateStats = (user) => {
    console.log(user);
  
    useStatsStore.setState((state) => ({
      userStats: {
        ...state.userStats, // Preserve existing stats
        totalUsers: (state.userStats?.totalUsers || 0) + 1, // Increment total user count
        newUsersByPeriod: {
          day: (state.userStats?.newUsersByPeriod?.day || 0) + 1,
          week: (state.userStats?.newUsersByPeriod?.week || 0) + 1,
          month: (state.userStats?.newUsersByPeriod?.month || 0) + 1,
        },
        newUsersByDayOfYear: {
          ...(state.userStats?.newUsersByDayOfYear || {}), // Preserve past records safely
          [new Date().toISOString().split("T")[0]]: (state.userStats?.newUsersByDayOfYear?.[new Date().toISOString().split("T")[0]] || 0) + 1,
        },
      },
    }));
  };
  



  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "NEW":
            handleUpdateStats(data.user);
          break;
        case "PING":
          ws.send(JSON.stringify({ type: "PONG" }));
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    setWebSocket(ws);
    return () => {
      ws.close();
    };
  }, []);
  
  return { websocket };
}

export default useWebSocketUsers;