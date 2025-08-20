import { useState } from "react";
import API from "../services/axiosInstance";

const ChatbotUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! 👋 How can I help you with your event?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/chatbot", { question: input });
      const botReply = response.data.answer || "Sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." }
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "linear-gradient(135deg, #4f46e5, #6366f1)",
            color: "#fff",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(79,70,229,0.4), 0 0 20px rgba(79,70,229,0.2)",
            fontSize: "28px",
            fontWeight: "bold",
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(true)}
        >
          🤖
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "370px",
            height: "520px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4f46e5",
              color: "#fff",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Event Planner Chat
            <span style={{ cursor: "pointer" }} onClick={() => setIsOpen(false)}>
              ✖
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === "user" ? "#4f46e5" : "#e5e7eb",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "16px",
                    maxWidth: "70%",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ fontStyle: "italic", color: "#555" }}>Typing...</div>
            )}
          </div>

          {/* Input Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f2f2f2",
              padding: "8px",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type Message"
              style={{
                flex: 1,
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                fontSize: "14px",
                padding: "6px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#A7D3FF",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotUI;
