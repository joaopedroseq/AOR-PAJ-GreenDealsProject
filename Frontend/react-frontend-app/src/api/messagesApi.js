import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const messagesEndpoint = `${apiBaseUrl}messages/`;

export const fetchMessages = async (token, username) => {
    try {
      const response = await axios.get(`${messagesEndpoint}${username}`, {
        headers: {
          "Content-Type": "application/json",
          "token": token, 
        },
      });
  
      if (response.status === 200) {
        return response.data; // Returning chat conversation data
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        console.error(`Error fetching chat (${status}):`, error.response.data);
  
        if (status === 401) {
          throw new Error("errorInvalidToken"); // 🔹 Token missing or invalid
        }
        if (status === 403) {
          throw new Error("errorPermissionDenied"); // 🔹 User is inactive/excluded
        }
        if (status === 404) {
          throw new Error("errorNonExistentConversation"); // 🔹 No conversation found
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error"); // 🔹 Network issue
      } else {
        console.error("Unexpected error:", error.message);
        throw new Error("errorUnexpected"); // 🔹 Any other unexpected issue
      }
    }
  };

  export const fetchAllConversations = async (token) => {
    try {
      const response = await axios.get(`${messagesEndpoint}all`, {
        headers: {
          "Content-Type": "application/json",
          "token": token, 
        },
      });
  
      if (response.status === 200) {
        return response.data; // ✅ Returning all conversations
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        console.error(`Error fetching all chats (${status}):`, error.response.data);
  
        if (status === 401) {
          throw new Error("errorInvalidToken"); // 🔹 Token missing or invalid
        }
        if (status === 403) {
          throw new Error("errorPermissionDenied"); // 🔹 User is inactive/excluded
        }
        if (status === 404) {
          throw new Error("errorNoConversations"); // 🔹 No conversations found
        }
      } else if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error"); // 🔹 Network issue
      } else {
        console.error("Unexpected error:", error.message);
        throw new Error("errorUnexpected"); // 🔹 Any other unexpected issue
      }
    }
  };