import { useEffect } from "react";
import { logOut } from "../services/auth";

export default function LogoutModal({ open, onClose }) {
    useEffect(() => {
        if (!open) return;

        const scrollY = window.scrollY;
        const html = document.documentElement;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.paddingRight = `${scrollBarWidth}px`;

        html.style.overflow = "hidden";
        html.style.scrollbarWidth = "none";

        const style = document.createElement("style");
        style.innerHTML = `
      html::-webkit-scrollbar,
      body::-webkit-scrollbar { display: none; }
    `;
        document.head.appendChild(style);

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflow = "";
            document.body.style.width = "";
            document.body.style.paddingRight = "";

            html.style.overflow = "";
            html.style.scrollbarWidth = "";

            document.head.removeChild(style);
            window.scrollTo(0, scrollY);
        };
    }, [open]);

    if (!open) return null;

    const handleLogout = async () => {
        await logOut();
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div
                className="rounded-2xl p-6 shadow-lg w-[320px] text-center
                   bg-[var(--card-bg)] dark:bg-[var(--panel-dark)]
                   border border-[var(--highlight-border)]"
                style={{ color: "var(--text)" }}
            >
                <h2 className="text-lg font-semibold mb-4">Вийти з акаунта?</h2>
                <div className="flex justify-center gap-4">
                    <button
                        className="px-4 py-2 rounded-lg font-semibold bg-[var(--highlight-bg)] hover:bg-[var(--highlight-border)] transition"
                        onClick={handleLogout}
                    >
                        Так
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition"
                        onClick={onClose}
                    >
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    );
}
