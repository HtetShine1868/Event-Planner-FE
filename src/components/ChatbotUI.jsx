import { useState } from "react";

const ChatbotUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! 👋 How can I help you with your event?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;

    // Add user message
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    // Bot reply
    let botReply = "Got it! I’ll help you with that.";
    if (input.toLowerCase().includes("book")) {
      botReply = "Sure! 📅 Let's get your event booked.";
    } else if (input.toLowerCase().includes("venue")) {
      botReply = "I have some great venues for you! 🏛️";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 500);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
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
      transition: "transform 0.2s, box-shadow 0.2s",
      zIndex: 1000,
    }}
    onClick={() => setIsOpen(true)}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.15)";
      e.currentTarget.style.boxShadow =
        "0 12px 24px rgba(79,70,229,0.5), 0 0 24px rgba(79,70,229,0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow =
        "0 8px 20px rgba(79,70,229,0.4), 0 0 20px rgba(79,70,229,0.2)";
    }}
  >
    🤖
  </div>
)}
      {/* Chatbox */}
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
            overflow: "hidden"
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
              fontWeight: "bold"
            }}
          >
            Event Planner Chat
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9"
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px"
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      msg.sender === "user" ? "#4f46e5" : "#e5e7eb",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    padding: "8px 12px",
                    borderRadius: "16px",
                    maxWidth: "70%",
                    fontSize: "14px",
                    lineHeight: "1.4"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f2f2f2",
              padding: "8px",
              borderTop: "1px solid #ddd"
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
                padding: "6px"
              }}
            />

            {/* Messenger Arrow Send Button */}
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#A7D3FF",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#2563EB"
                width="20px"
                height="20px"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotUI;
