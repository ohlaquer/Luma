// src/components/ChatMessages.jsx
import { useEffect, useRef } from "react";

export default function ChatMessages({ messages }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatRef} className="flex flex-col gap-2 overflow-y-auto px-1 pr-2 flex-grow">
      {messages.map((msg, index) => (
        <div
          key={index}
          className="max-w-[80%] px-4 py-2 rounded-xl"
          style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            backgroundColor:
              msg.role === "user" ? "var(--neutral-bg)" : "var(--highlight-bg)",
            color: "var(--text)",
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
