export default function MobileFooter() {
  return (
      <footer className="block md:hidden w-full text-center pt-3 bg-[var(--accent-bg)] text-[var(--text)] transition-colors duration-200">
          <div className="inline-block px-4 py-2 rounded-t-xl bg-white dark:bg-[var(--card-bg)] text-[var(--text)] dark:text-[var(--card-text)] transition-colors duration-200">
              © 2025 Luma. Цей сервіс не є медичною або психіатричною допомогою.
          </div>
      </footer>
  );
}
