// JournalTextarea.jsx
import React from "react";

export default function JournalTextarea({ text, setText }) {
  return (
    <textarea
      className="w-full h-60 px-5 py-4 bg-white/90 dark:bg-[var(--bg)] text-[var(--text)] resize-none focus:outline-none placeholder-[var(--muted)]"
      placeholder="Почніть писати..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

