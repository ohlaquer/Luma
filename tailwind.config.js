// tailwind.config.js
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#34495E',
        bg: 'var(--bg)',
        text: 'var(--text)',
        primary: 'var(--primary)',
        'muted-text': 'var(--muted-text)',
        'card-bg': 'var(--card-bg)',
        'card-text': 'var(--card-text)',
        'highlight-bg': 'var(--highlight-bg)',
        'highlight-border': 'var(--highlight-border)',
        'button-bg': 'var(--button-bg)',
        'button-text': 'var(--button-text)',
        danger: 'var(--danger)',
        'danger-bg': 'var(--danger-bg)',
        'danger-text': 'var(--danger-text)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
