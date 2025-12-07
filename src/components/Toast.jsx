import { useEffect, useState } from "react";

export default function Toast({ message, duration = 5000, onClose }) {
    const [visible, setVisible] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            setShow(false);

            requestAnimationFrame(() => {
                setShow(true);
            });

            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 500);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!visible) return null;

    // 🎨 вибір кольору по типу повідомлення
    let bgColor = "var(--accent, #6AA6E5)";   // м’який синій — інфо
    let textColor = "var(--button-text, #fff)";

    if (message.startsWith("✅")) {
        bgColor = "var(--success, #6AE58A)"; // м'який зелений
    } else if (message.startsWith("❌")) {
        bgColor = "var(--danger, #E56A6A)";  // теплий червоний Luma
    } else if (message.startsWith("🔑") || message.startsWith("📧")) {
        bgColor = "var(--accent, #76B3E8)";  // світліший блакитний
    }


    return (
        <div
            className={`mt-4 px-6 py-3 rounded-lg shadow text-sm font-medium transition-all duration-500 transform
            ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
            style={{
                backgroundColor: bgColor,
                color: textColor,
                maxWidth: "448px",
                textAlign: "center",
            }}
        >
            {message}
        </div>
    );
}
