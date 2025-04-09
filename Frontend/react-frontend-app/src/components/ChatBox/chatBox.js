import { useState } from "react";
import WebSocketClient from "../../websocket/WebSocketClient";

const ChatBox = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const { sendMessage } = WebSocketClient(); // Use WebSocketClient for sending messages

  const handleSend = () => {
    if (username && message) {
        console.log(username + " message: " + message);
      sendMessage(username, message);
      setMessage(""); // Clear message input
    }
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", width: "300px" }}>
      <h3>Chat Box</h3>
      <input
        type="text"
        placeholder="Receiver Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <textarea
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginBottom: "5px" }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatBox;