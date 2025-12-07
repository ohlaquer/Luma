import { useNavigate, useLocation } from "react-router-dom";

export default function BackLink({ text = "Назад", fallback = "/cabinet" }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        if (window.history.length <= 2 || location.key === "default") {
            navigate(fallback);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex justify-start mb-6">
            <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-full transition
                    bg-[var(--button-bg)] text-[var(--button-text)]
                    hover:scale-105 shadow-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                {text}
            </button>
        </div>
    );
}

