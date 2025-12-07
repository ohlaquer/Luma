// MoodSelector.jsx
import { motion } from "framer-motion";
import { Laugh, Smile, Meh, Frown, Angry } from "lucide-react";

const moods = [
  { icon: Laugh, label: "Радість", value: "happy" },
  { icon: Smile, label: "Спокій", value: "calm" },
  { icon: Meh, label: "Нейтрально", value: "neutral" },
  { icon: Frown, label: "Сум", value: "sad" },
  { icon: Angry, label: "Злість", value: "angry" },
];

export default function MoodSelector({ mood, setMood }) {
  return (
    <div className="flex justify-center gap-4 px-4 py-4">
      {moods.map(({ icon: Icon, label, value }) => {
        const isActive = mood === value;
        return (
          <motion.button
            key={value}
            onClick={() => setMood(value)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.1 }}
            animate={{ scale: isActive ? 1.4 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center border
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-800 shadow-lg"
                  : "bg-[var(--hover)] text-[var(--text)] border-transparent hover:bg-[var(--highlight-border)]"
              }`}
            title={label}
          >
            <Icon className="w-6 h-6" />
          </motion.button>
        );
      })}
    </div>
  );
}
