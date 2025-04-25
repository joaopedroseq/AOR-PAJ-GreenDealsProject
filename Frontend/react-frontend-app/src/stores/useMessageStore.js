import { fetchMessages, fetchAllConversations } from "../Api/messagesApi";
import { create } from "zustand";

const useMessageStore = create((set) => ({
    messages: [],
    conversations: [], // Stores unique conversation users
    
    fetchAllConversations: async (token) => {
      try {
        const conversationUsers = await fetchAllConversations(token); // Fetch unique users
        console.log(conversationUsers);
        set({ conversations: conversationUsers});
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },
  
  
    fetchUserConversation: async (token, username) => {
      set({ loading: true, error: null });
      try {
        const userMessages = await fetchMessages(token, username); // Directly returns an array
        set({ messages: userMessages }); // No need for extraction
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    resetMessages: () => set({ messages: [] }),
  }));
  
  export default useMessageStore;
  