export default function DesktopFooter() {
  return (
    <footer className="hidden md:flex justify-center w-full px-6 py-10 bg-transparent">
      <div className="inline-block max-w-6xl px-6 py-3 rounded-full shadow-sm
        bg-white dark:bg-[var(--card-bg)]
        text-[var(--text)] dark:text-[var(--card-text)]
        transition-colors duration-150 ease-in-out">
        © 2025 Luma. Цей сервіс не є медичною або психіатричною допомогою.
      </div>
    </footer>
  );
}
