// src/components/ChatInput.jsx
import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, handleSend, disabled }) {
    const textareaRef = useRef(null);

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!disabled) handleSend();
        }
        // Shift+Enter працює як перенос (нічого не блокуємо)
    };

    // авто-розширення висоти
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px"; // до 160px
    }, [input]);

    return (
        <div
            className="mt-4 flex items-center rounded-xl px-4 py-2 gap-2"
            style={{ backgroundColor: "var(--neutral-bg)" }}
        >
  <textarea
      ref={textareaRef}
      placeholder={disabled ? "Зачекай, Лума пише..." : "Напишіть щось..."}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      rows={1}
      className={`flex-1 bg-transparent outline-none resize-none 
                  overflow-hidden placeholder:text-[var(--muted-text)] 
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={{
          color: "var(--text)",
          paddingTop: "0.4rem", // трішки відступу щоб текст красиво сидів
          paddingBottom: "0.4rem",
      }}
  />
            <button
                onClick={handleSend}
                disabled={disabled}
                className={disabled ? "opacity-50 cursor-not-allowed" : ""}
                aria-disabled={disabled}
                title={disabled ? "Зачекай, Лума пише…" : "Надіслати"}
            >
                <Send size={20} style={{ color: "var(--muted-text)" }} />
            </button>
        </div>

    );
}
