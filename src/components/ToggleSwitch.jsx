// src/components/ToggleSwitch.jsx
export default function ToggleSwitch({ checked, onChange, disabled }) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                disabled
                    ? "bg-gray-400 cursor-not-allowed opacity-60"
                    : checked
                        ? "bg-blue-500"
                        : "bg-gray-300 dark:bg-gray-600"
            }`}
        >
            <span
                className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}
