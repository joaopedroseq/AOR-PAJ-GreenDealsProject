import { useState, useEffect } from "react";
import useStatsStore from "../Stores/useStatsStore";
import useUsersDataStore from "../Stores/useUsersDataStore";

function useWebSocketUsers() {
  const WS_URL = "ws://localhost:8080/sequeira-proj5/websocket/users/";
  const [websocket, setWebSocket] = useState(null);


  const handleUpdateStats = (user) => {  
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

  const handleUserUpdate = (user) => {
    if (!user || !user.username) return; // Ensure valid user
  
    useUsersDataStore.setState((state) => {
      const existsInFiltered = state.filteredUsers.some((u) => u.username === user.username);
      const existsInAllUsers = state.allUsers.some((u) => u.username === user.username);
  
      // Helper function to merge non-null fields
      const mergeUserData = (existingUser) => ({
        ...existingUser,
        ...Object.fromEntries(Object.entries(user).filter(([key, value]) => value !== null)),
      });
  
      const updatedFilteredUsers = existsInFiltered
        ? state.filteredUsers.map((u) => (u.username === user.username ? mergeUserData(u) : u))
        : state.filteredUsers;
  
      const updatedAllUsers = existsInAllUsers
        ? state.allUsers.map((u) => (u.username === user.username ? mergeUserData(u) : u))
        : [...state.allUsers, user]; // Add user if not found
  
      console.log("Updated filtered users list:", updatedFilteredUsers);
      console.log("Updated all users list:", updatedAllUsers);
  
      return { filteredUsers: updatedFilteredUsers, allUsers: updatedAllUsers };
    });
  
    console.log("Users Data Store:", useUsersDataStore.getState()); // ✅ Debug log
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
        case "UPDATE":
          console.log(data);
          handleUserUpdate(data.user);
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