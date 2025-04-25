import React, { useState, useEffect } from "react";
import useMessageStore from "../../Stores/useMessageStore";
import useUserStore from "../../Stores/useUserStore";
import "./chat.css";

export const Chat = () => {
  const token = useUserStore((state) => state.token);
  const { conversations, fetchAllConversations, messages, fetchUserConversation, resetMessages } = useMessageStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
      fetchAllConversations(token);
  }, [token]);

  useEffect(() => {
      if (selectedUser) {
          fetchUserConversation(token, selectedUser.username);
      }
  }, [selectedUser]);

  const handleSendMessage = () => {
      if (messageInput.trim() !== "") {
          // Here you'd integrate WebSocket or API call to send the message
          console.log(`Sending message to ${selectedUser.username}:`, messageInput);
          setMessageInput(""); // Clear input after sending
      }
  };

  return (
      <div className="chat-container">
          {/* Sidebar */}
          <aside className="chat-sidebar">
              <h2>Messages</h2>
              <ul>
                  {conversations.map((user) => (
                      <li
                          key={user.username}
                          onClick={() => {
                              resetMessages();
                              setSelectedUser(user);
                          }}
                          className={`chat-user ${selectedUser?.username === user.username ? "active" : ""}`}
                      >
                          <img src={user.url} alt={user.username} className="profile-image" />
                          <span>{user.username}</span>
                      </li>
                  ))}
              </ul>
          </aside>

          {/* Chat Body */}
          <section className="chat-body">
              {selectedUser ? (
                  <>
                      <div className="chat-header">
                          <img src={selectedUser.url} alt={selectedUser.username} className="profile-image" />
                          <h2>{selectedUser.username}</h2>
                      </div>

                      <div className="messages">
                          {messages.length > 0 ? (
                              messages.map((msg, index) => (
                                  <div key={index} className={`message ${msg.sender === token ? "sent" : "received"}`}>
                                      <p>{msg.message}</p>
                                  </div>
                              ))
                          ) : (
                              <p className="empty-chat">Start chatting!</p>
                          )}
                      </div>

                      {/* Message Input */}
                      <div className="chat-input">
                          <input
                              type="text"
                              placeholder="Type a message..."
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                          />
                          <button onClick={handleSendMessage}>Send</button>
                      </div>
                  </>
              ) : (
                  <p className="empty-chat">Select a conversation to view messages</p>
              )}
          </section>
      </div>
  );
};

export default Chat;
